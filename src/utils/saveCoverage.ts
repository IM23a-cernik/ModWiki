import * as fs from 'fs';
import * as path from 'path';
import { ClientFunction } from 'testcafe';

const getCoverage = ClientFunction(() => (window as any).__coverage__);

export async function saveCoverage(testName: string) {
    const coverage = await getCoverage();
    if (!coverage) {
        console.warn('No coverage data found');
        return;
    }

    const dir = path.join('coverage', 'e2e', 'json');
    fs.mkdirSync(dir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `coverage_${timestamp}_${testName.replace(/\W+/g, '_')}.json`;

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, JSON.stringify(coverage));

    console.log(`✔ Coverage saved: ${filePath}`);
}