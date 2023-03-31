import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { readFile } from 'fs/promises';
import * as lght from './index.lighthouse.js';

chai.use(chaiAsPromised);
let expect = chai.expect;

const budget = JSON.parse(
  await readFile(
    new URL('./budget.json', import.meta.url)
  )
);

const performanceBudget = await lght.performanceBudget();

describe('index.html', function() {
    describe('Lighthouse metrics', function() {
        this.timeout(60000);
        describe('Budget', function() {
            it('should come in under budget', async function() {
                return expect(await performanceBudget).to.have.property('sizeOverBudget').to.equal(0, 'Looks like you\'re about ' + Math.round(performanceBudget['sizeOverBudget'] / 1024 - budget[0].resourceSizes.find(element => element.resourceType = "total").budget) + 'kb over budget');
            });
        });
        describe('Items', function() {
            it('have 9 images', async function() {
                return expect(await performanceBudget).to.have.property('requestCount').to.be.at.least(8, 'Missing some images?');
            });
        });
    });
});