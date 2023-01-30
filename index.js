const express = require("express");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const fs = require("fs");
let ejsTemplate = fs.readFileSync("index.ejs", "utf8");

const app = express();

app.get("/", (req, res) => {
	// const template = `<h1><%= title %></h1><p><%= content %></p>`;
	const data = { title: "My PDF Title", content: "This is the content of my PDF" };
	generatePDF(ejsTemplate, data).then((pdf) => {
		fs.writeFileSync("example.pdf", pdf);
	});

	res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});

async function generatePDF(template, data) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const html = ejs.render(template, data);
	await page.setContent(html);

	const pdf = await page.pdf({
		// path: __dirname + '/example.pdf',
		format: "A4",
		printBackground: true,
	});

	await browser.close();
	return pdf;
}
