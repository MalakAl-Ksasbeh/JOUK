# JOUK — Explore Jordan

JOUK is a web platform developed by **Team Outlier** to help people discover Jordan beyond traditional tourism.

The website brings together historical landmarks, natural attractions, hidden gems, modern places, local activities, and events. Users can explore destinations based on their interests, plan personalized trips, save places, and share experiences with other travelers.

![Explore Jordan](screenshots/explore-jordan.png)

## Features

### Explore Jordan

Browse destinations through four categories:

- **Relax:** Natural escapes and peaceful destinations.
- **Culture:** Historical sites and cultural attractions.
- **Adventure:** Outdoor activities and adventure destinations.
- **Something to Do:** Local activities, modern attractions, and seasonal events.

Destination pages include an overview, highlights, things to do, packing suggestions, and nearby places.

![Relax destinations](screenshots/relax-destinations.png)

### Build Your Own Mix

Select or drag category puzzle pieces to combine interests and discover destinations from the chosen categories.

![Build Your Own Mix](screenshots/build-your-mix.png)

### My Path

Create a personalized trip by selecting destinations, choosing the number of days, and organizing places into an itinerary. View the trip on an illustrated map of Jordan or open the route in Google Maps. Saved plans can be accessed and managed through the user profile.

### Community

Share experiences, upload photos, rate places, and explore recommendations from other travelers. Browse posts by category and view traveler profiles.

![Traveler Community](screenshots/community.png)

Users can also submit their own experiences through the sharing form.

![Share Your Experience](screenshots/share-experience.png)

### User Accounts

JOUK includes registration and login, personal profiles, saved destinations, visited places, and saved trip plans.

## Tech Stack

- **HTML5** — Page structure.
- **CSS3** — Styling and responsive layouts.
- **JavaScript** — Interactive features.
- **Firebase** — Authentication and data storage.

## Project Structure

```text
JOUK/
├── about/
├── data/
├── home page/
├── images/
├── other pages/
│   ├── chat/
│   ├── create-plan/
│   ├── messages/
│   ├── other-profile/
│   ├── place/
│   ├── profile/
│   ├── saved-places/
│   └── view-plan/
├── paths/
├── plans/
│   ├── adventures/
│   ├── culture/
│   ├── relax/
│   └── something to do/
├── reviews/
│   ├── community/
│   └── share-experience/
├── shared/
│   └── fonts/
└── sign up-log in/
```

## Current Limitations

Some features are still in development:

- Messaging uses demo conversations rather than account-specific chats.
- Community comments are not yet functional, and likes are not consistently account-specific.
- Shared experiences appear in Community but not yet on their corresponding destination pages.
- Photo uploads work in the Community sharing form, but not in destination-specific forms.
- The destination-level **Add to My Path** button does not yet add places directly to a trip.
- **Edit This Trip** on the trip-view page currently returns users to trip creation.

## Team Members

Developed by **Team Outlier**.

- [Malak Al Ksasbeh](https://github.com/MalakAl-Ksasbeh)
- [Sura Al Btoosh](https://github.com/sura-albtoosh)
- [Yaqeen Qatawneh](https://github.com/yaqeenqatawneh06)
- [Afaf Alaa](https://github.com/Afaf-Alaa)

