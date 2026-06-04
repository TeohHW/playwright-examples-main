import { test, expect, type Page } from '@playwright/test';

test('List Resources', async ({ page }) => {
   await page.goto('https://jsonplaceholder.typicode.com/posts');
   const response = await page.request.get('https://jsonplaceholder.typicode.com/posts');
   const json     = await response.json();
   expect(response.status()).toBe(200);
   console.log(json);

});
test('List Specific Resources', async ({ page }) => {
   await page.goto('https://jsonplaceholder.typicode.com/posts/1');
   const response = await page.request.get('https://jsonplaceholder.typicode.com/posts/1');
   const json     = await response.json();
   expect(response.status()).toBe(200);
   console.log(json);
});
test('filter Resources', async ({ page }) => {
   await page.goto('https://jsonplaceholder.typicode.com/posts?userId=1');
   const response = await page.request.get('https://jsonplaceholder.typicode.com/posts?userId=1');
    const json     = await response.json();
    expect(response.status()).toBe(200);
    console.log(json);
});
test('Listing Nested Resources', async ({ page }) => {
   await page.goto('https://jsonplaceholder.typicode.com/posts/1/comments');
   const response = await page.request.get('https://jsonplaceholder.typicode.com/posts/1/comments');
    const json = await response.json();
    expect(response.status()).toBe(200);
    console.log(json);
});