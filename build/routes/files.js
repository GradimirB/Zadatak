"use strict";
// import { Router, Request, Response } from 'express';
// import axios from 'axios';
// import { Any } from 'typeorm';
// const router = Router();
// const EXTERNAL_API_URL = 'https://rest-test-eight.vercel.app/api/test';
// export interface TransformedData {
//     [ip: string]: Array<{
//         [directory: string]: Array<any>
//     }>
// }
// export function transformData(urls: string[]): TransformedData {
//     const result: TransformedData = {};
//     urls.forEach(url => {
//         const urlParts = new URL(url);
//         const ip = urlParts.hostname;
//         const pathParts = urlParts.pathname.split('/').filter(part => part);
//         if (!result[ip]) {
//             result[ip] = [];
//         }
//         let currentLevel = result[ip];
//         pathParts.forEach((part, index) => {
//             if (index === pathParts.length - 1) {
//                 currentLevel.push(part);
//             } else {
//                 let existingDir = currentLevel.find(item => typeof item === 'object' && item.hasOwnProperty(part));
//                 if (!existingDir) {
//                     existingDir = { [part]: [] };
//                     currentLevel.push(existingDir);
//                 }
//                 currentLevel = existingDir[part];
//             }
//         });
//     });
//     return result;
// }
