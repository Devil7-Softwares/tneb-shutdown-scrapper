# TNEB-SHUTDOWN-SCRAPPER

![NPM Version](https://img.shields.io/npm/v/tneb-shutdown-scrapper) ![Tests](https://img.shields.io/github/actions/workflow/status/Devil7-Softwares/tneb-shutdown-scrapper/run-tests.yml) ![NPM Total Downloads](https://img.shields.io/npm/dt/tneb-shutdown-scrapper) ![License](https://img.shields.io/npm/l/tneb-shutdown-scrapper)

## Disclaimer:

This package is developed solely for educational purposes and is not in any way affiliated with, endorsed by, or related to the Tamil Nadu Electricity Board (TNEB) or the Government of Tamil Nadu. The information obtained through this package is collected from publicly accessible websites, and the package's purpose is to demonstrate web scraping techniques for educational and learning purposes only.

The creators and developers of this package do not assume any responsibility for the accuracy, reliability, or legality of the data obtained through this package. Users of this package are encouraged to use the data responsibly and in compliance with all applicable laws and regulations.

By using this package, you acknowledge that it is not an official TNEB or government package, and any actions or decisions made based on the data obtained through this package are at your discretion and risk.

Please note that web scraping may be subject to legal restrictions and terms of use imposed by websites, and it is essential to respect the terms and policies of websites you access.

## Introduction

This is a simple node package that allows fetching the planned shutdown schedule from [TNEB's website](https://www.tnebltd.gov.in/outages/viewshutdown.xhtml). This is a demonstration of how easily data can be scrapped while bypassing the basic captcha mechanisms these websites use.

## Usage

```javascript
import { fetchCircles, fetchShutdownSchedule } from 'tneb-shutdown-scrapper';

const circles = await fetchCircles();

fetchShutdownSchedule(circles[0].value).then((schedule) => {
  console.log(schedule);
});
```
