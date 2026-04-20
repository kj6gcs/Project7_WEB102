# Web Development Project 7 - _Crewmates_

Submitted by: **Robby Wideman**

This web app: **Crewmates can help you setup your own crew for a specific game... Maybe it's _Among Us_, maybe it's not...**

Time spent: **7** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate
  - Users can set the crewmate’s attributes by clicking on one of several values
- [x] **The web app includes a summary page of all the user’s added crewmates**
  - The web app contains a summary page dedicated to displaying all the crewmates the user has made so far
  - The summary page is sorted by creation date such that the most recently created crewmates appear at the top
- [x] **A previously created crewmate can be updated from the list of crewmates in the summary page**
  - Each crewmate has an edit button that will take users to an update form for the relevant crewmate
  - Users can see the current attributes of their crewmate on the update form
  - After editing the crewmate's attribute values using the form, the user can immediately see those changes reflected in the update form and on the summary page
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - Using the edit form detailed in the previous _crewmates can be updated_ feature, there is a button that allows users to delete that crewmate
  - After deleting a crewmate, the crewmate should no longer be visible in the summary page
  - [x] **Each crewmate has a direct, unique URL link to an info page about them**
    - Clicking on a crewmate in the summary page navigates to a detail page for that crewmate
    - The detail page contains extra information about the crewmate not included in the summary page
    - Users can navigate to to the edit form from the detail page

The following **optional** features are implemented:

- [x] A crewmate can be given a category upon creation which restricts their attribute value options
  - e.g., a Dungeons and Dragons class or a development team role (project manager, product owner, etc.)
  - User can choose a `category` option to describe their crewmate before any attributes are specified
  - Based on the category value, users are allowed to access only a subset of the possible attributes
- [x] A section of the summary page, displays summary statistics about a user’s crew on their crew page
  - e.g., the percent of members with a certain attribute
- [ ] The summary page displays a custom “success” metric about a user’s crew which changes the look of the crewmate list
  - e.g., a pirate crew’s predicted success at commandeering a new galley

The following **additional** features are implemented:

- [x] In the navbar, you can click the app name/logo on the left side to be taken to the main page.
- [x] Crewmates can be created from links on the main page _and_ the right side of the navbar.
- [x] The Crew Gallery can be viewed from links on the main page _and_ the right side of the navbar.

## Video Walkthrough

Here’s a video walkthrough of the implemented required features:

<p align="center">
  <a href="https://youtu.be/8FRLqqSLLqg" target="_blank" rel="noopener noreferrer">
    <img src="https://img.youtube.com/vi/8FRLqqSLLqg/hqdefault.jpg" width="600" alt="Video Walkthrough Thumbnail">
  </a>
</p>

## Notes

_The API call for this won't actually work if you download my repo - it's tucked away in the .env which gets ignored by the .gitignore file. Since it's not a public API and linked directly with my Supabase account, I'm not including the details due to security reasons (to the public repo - if CodePath staff would like it, they can simply request - but it's all in the video at least)._

I was actually pretty sick while working on this app. Fighting between being too cold and too hot during the coding process drug it out quite the bit (hence why it took 7+ hours to complete). While making the video walkthrough, I discovered I hadn't met one of the _stretch_ features, and unlike I usually do, I just left it not completed (it was a stretch goal, afterall).

## License

    Copyright 2026 Robby Wideman

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
