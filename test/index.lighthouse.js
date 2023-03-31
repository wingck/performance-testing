import express from 'express';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';
import { readFile } from 'fs/promises';
const budget = JSON.parse(
  await readFile(
    new URL('./budget.json', import.meta.url)
  )
);

const app = express();

export async function performanceBudget() {
    const port = 4321;
    app.use(express.static('public'));

    const server = app.listen(port, () => console.log(`LH Server listening on port: ${port}`));
    const url = 'http://localhost:' + port;
    const browser = await puppeteer.launch();

    const config = {
      extends: 'lighthouse:default',
      settings: {
        budgets: budget
      }
    }

    const { lhr } = await lighthouse(url, {
        port: (new URL(browser.wsEndpoint())).port,
        output: 'json'
    }, config);

    const auditResult = lhr['audits']['performance-budget'].details.items.find(element => element.resourceType = "total");
    auditResult.sizeOverBudget = auditResult.sizeOverBudget ?? 0;

    await browser.close();
    await server.close();
    return auditResult;
};