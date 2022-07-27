import express from "express";
import url from "url";
import bodyParser from "body-parser";

const publicDir = process.cwd() + "/dist";

const app = express();

app.use(express.static(process.cwd()))
app.use(bodyParser.urlencoded({
    extended: true
}));

const shortenedLinks = new Map();


app.get("/", (req, res) => {
    res.sendFile(publicDir);
});


app.post("/urlshortner", (req, res) => {
    // console.log(req.headers.referer);
    const { url, shortUrl } = req.body;

    if (!url || !shortUrl) { res.status(400).send("url of short key was not found"); return; }


    if (shortenedLinks.has(shortUrl)) { res.status(406).send("Please enter other keyword"); return; }

    shortenedLinks.set(shortUrl, url);

    const newUrl = req.headers.referer + "to/" + shortUrl;

    res.send("successfully shortened " + anchorify(url) + " to " + anchorify(newUrl));

});

app.get("/to/:key", (req, res) => {
    if (!shortenedLinks.has(req.params.key)) { res.status(404).send("Requested url not found"); return; }

    //308 Permanent Redirect
    res.status(308).redirect(shortenedLinks.get(req.params.key));
});

app.listen(process.env.port || 3000, () => console.log("service started on http://localhost:3000"));


function anchorify(url) {
    return "<a href=" + url + ">" + url + "</a>";
}