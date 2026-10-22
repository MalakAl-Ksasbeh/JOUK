# JOUK — Explore Jordan

JOUK is a web platform developed by **Team Outlier** to help people discover Jordan beyond traditional tourism.

The website brings together historical landmarks, natural attractions, hidden gems, modern places, local activities, and events. Users can explore destinations based on their interests, plan personalized trips, save places, and share experiences with other travelers.

![JOUK Home Page](README%20photos/photos/home.png)

## Features

### Explore Jordan

Explore destinations through four categories:

- **Relax:** Natural escapes and peaceful destinations.
- **Culture:** Historical sites and cultural attractions.
- **Adventure:** Outdoor activities and adventure destinations.
- **Something to Do:** Local activities, modern attractions, and seasonal events.

![JOUK Plans](README%20photos/photos/plans.png)

### Build Your Own Mix

Select or drag puzzle pieces to combine different categories and discover destinations that match your interests.

![Build Your Own Mix](README%20photos/photos/build-your-own-mix.png)

### Destination Details

Each destination has an overview, quick information, highlights, things to do, suggestions on what to bring, and nearby places. Some nearby recommendations link to Google Maps. Visitors can also save destinations for later.

![Petra Destination Details](README%20photos/photos/petra.png)

### My Path

Create a personalized Jordan trip by naming it, choosing the number of days, and selecting destinations from different categories. The selected places are displayed in an itinerary on an illustrated map of Jordan, with an option to open the route in Google Maps. Saved plans can be viewed, edited, or deleted from the user profile.

![My Path Map](README%20photos/photos/my-path.png)

### Community

Share experiences, upload photos, rate places, and browse stories from other travelers. Posts can be explored by category, and travelers can view other users' profiles.

![JOUK Community](README%20photos/photos/community.png)

### User Accounts

Registered users can manage saved plans and visited places, as well as update their profile name, bio, and location.

![User Profile](README%20photos/photos/profile.png)

### Authentication

JOUK provides sign-up and login pages, along with an option to continue as a guest.

![JOUK Login](README%20photos/photos/login.png)

## Tech Stack

- **HTML5** — Page structure and content.
- **CSS3** — Styling and responsive layouts.
- **JavaScript** — Interactive features.
- **Firebase** — Authentication and data storage.

## Project Structure

```text
Team-Outlier-JOUK/
├── README.md
├── README/
│   └── photos/
│       ├── home.png
│       ├── plans.png
│       ├── login.png
│       └── ...
├── home page/
├── plans/
├── paths/
└── ...
```

## Current Limitations

Some features are still under development:

- Messaging currently uses demo conversations rather than account-specific chats.
- Community comments are not yet functional, and likes are not consistently account-specific.
- Shared experiences appear in the Community feed but not yet on their corresponding destination pages.
- Photo uploads work through the Community sharing form but not through destination-specific forms.
- The destination-level **Add to My Path** button provides visual feedback but does not add places directly to a trip.
- **Edit This Trip** on the trip-view page currently returns users to the trip creation flow; saved plans can be edited from the profile.

## Team Members

Developed by **Team Outlier**.

- [Malak Al Ksasbeh](https://github.com/MalakAl-Ksasbeh)
- [Sura Al Btoosh](https://github.com/sura-albtoosh)
- [Yaqeen Qatawneh](https://github.com/yaqeenqatawneh06)
- [Afaf Alaa](https://github.com/Afaf-Alaa)
