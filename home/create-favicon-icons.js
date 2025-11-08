#!/usr/bin/env node

/**
 * سكريبت لإنشاء favicon و icons من SVG
 * Script to create favicon and icons from SVG
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// قراءة ملف SVG
const svgPath = join(__dirname, 'src', 'assets', 'taxi-logo-icon.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

// إنشاء نسخة PNG بسيطة (SVG مضمن في HTML)
// في الواقع، سنستخدم SVG مباشرة في favicon
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Left side - Light blue chevrons pointing right -->
  <path d="M 50 200 L 150 256 L 50 312 L 100 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  <path d="M 100 150 L 200 256 L 100 362 L 150 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  
  <!-- Right side - Hot pink X shape -->
  <path d="M 250 100 L 350 200 L 250 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  <path d="M 350 100 L 250 200 L 350 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  
  <!-- Additional decorative elements -->
  <path d="M 400 150 L 450 256 L 400 362 L 425 256 Z" fill="#FF00FF" stroke="none" rx="10"/>
</svg>`;

// حفظ favicon.svg
const faviconPath = join(__dirname, 'public', 'favicon.svg');
writeFileSync(faviconPath, faviconSvg, 'utf-8');

// إنشاء icon-192.svg
const icon192Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Left side - Light blue chevrons pointing right -->
  <path d="M 50 200 L 150 256 L 50 312 L 100 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  <path d="M 100 150 L 200 256 L 100 362 L 150 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  
  <!-- Right side - Hot pink X shape -->
  <path d="M 250 100 L 350 200 L 250 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  <path d="M 350 100 L 250 200 L 350 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  
  <!-- Additional decorative elements -->
  <path d="M 400 150 L 450 256 L 400 362 L 425 256 Z" fill="#FF00FF" stroke="none" rx="10"/>
</svg>`;

// حفظ icon-192.svg
const icon192Path = join(__dirname, 'public', 'icon-192.svg');
writeFileSync(icon192Path, icon192Svg, 'utf-8');

// إنشاء icon-512.svg
const icon512Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Left side - Light blue chevrons pointing right -->
  <path d="M 50 200 L 150 256 L 50 312 L 100 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  <path d="M 100 150 L 200 256 L 100 362 L 150 256 Z" fill="#00D4FF" stroke="none" rx="10"/>
  
  <!-- Right side - Hot pink X shape -->
  <path d="M 250 100 L 350 200 L 250 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  <path d="M 350 100 L 250 200 L 350 300 L 300 200 Z" fill="#FF00FF" stroke="none" rx="10"/>
  
  <!-- Additional decorative elements -->
  <path d="M 400 150 L 450 256 L 400 362 L 425 256 Z" fill="#FF00FF" stroke="none" rx="10"/>
</svg>`;

// حفظ icon-512.svg
const icon512Path = join(__dirname, 'public', 'icon-512.svg');
writeFileSync(icon512Path, icon512Svg, 'utf-8');

console.log('✅ تم إنشاء favicon.svg و icon-192.svg و icon-512.svg بنجاح!');
console.log('✅ Created favicon.svg, icon-192.svg, and icon-512.svg successfully!');

