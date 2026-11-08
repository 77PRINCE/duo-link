# DUO LINK — MASTER PRODUCT IMPLEMENTATION INSTRUCTIONS

## 1. YOUR ROLE

Act as a senior full-stack software engineer, software architect and technical building adviser.

You are responsible for helping implement Duo Link into a functional local development demo.

Do not behave like a code generator that blindly creates files. Understand the existing project, make technically sound decisions, implement carefully, test your work and explain important architectural choices.

You must work with the developer as a technical partner.

Your job is to build a functional product, not merely an attractive interface.

---

## 2. PRODUCT IDENTITY

**Product name:** Duo Link

**Tagline:** One link. The right destination.

**Core principle:** Simple on the outside. Intelligent on the inside.

### Product description

Duo Link is a smart link-routing platform designed to simplify mobile application distribution.

A developer often has separate download links for Android and iOS applications.

Instead of sharing two different links, Duo Link allows a developer to create one smart, shareable URL.

When someone opens that URL, Duo Link identifies the visitor's operating system and presents the appropriate application download destination.

The experience should be simple, professional and reliable.

### Example

A developer owns an application called Example App.

The developer supplies:

- Android Google Play Store URL.
- iOS Apple App Store URL.
- Application name.
- Custom URL slug.

Duo Link generates:

`https://duolink.example/r/example-app`

When visitors open the link:

- Android visitors see the Android download option.
- iOS visitors see the iOS download option.
- Unsupported devices receive a fallback experience.

IMPORTANT: This is an intermediate branded download page, not an automatic redirect system.

The visitor should see the relevant destination and explicitly click the download button.

---

## 3. PRODUCT OBJECTIVES

The initial implementation must support:

1. Creating smart links.
2. Supplying Android and iOS store URLs.
3. Providing an application name.
4. Creating a custom slug.
5. Generating a unique shareable URL.
6. Detecting the visitor's operating system.
7. Displaying the appropriate download experience.
8. Providing a fallback experience for unsupported devices.
9. Copying and sharing generated links.
10. Viewing previously created links.
11. Editing existing links.
12. Deleting links.

The application must work locally during development.

Do not introduce production deployment requirements at this stage.

---

## 4. TECHNOLOGY STACK

The project uses a separate frontend and backend inside one monorepository.

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

### Backend

- Python
- FastAPI
- Uvicorn

### Database direction

PostgreSQL is the planned primary database.

Supabase may be considered later as a managed PostgreSQL solution.

Do not introduce a database or change the persistence strategy without first inspecting the current implementation and explaining the recommended approach.

If persistence is necessary for the first working demo, recommend a lightweight local solution that can be migrated cleanly to PostgreSQL.

### Development environment

- Ubuntu Linux.
- VS Code / OpenCode.
- Local frontend development server.
- Local FastAPI development server.

---

## 5. EXISTING PROJECT STRUCTURE

The project is expected to resemble:

duo-link/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── api/
│   │       └── routes/
│   ├── requirements.txt
│   └── .venv/
│
├── docs/
├── .gitignore
└── README.md

This is an expected structure, not permission to recreate the repository blindly.

Inspect the actual files and adapt to what already exists.

---

## 6. IMPORTANT DEVELOPMENT RULES

Before writing code:

1. Inspect the existing repository.
2. Identify the current frontend and backend structure.
3. Inspect package.json and Python dependencies.
4. Identify existing pages, components and forms.
5. Identify incomplete files and existing functionality.
6. Check whether the frontend and backend are already operational.

Do not overwrite existing working code without a technical reason.

Do not create duplicate components or unnecessary files.

Do not install libraries just because they are popular.

Keep the architecture understandable and maintainable.

Use clear naming conventions and reusable components.

Use TypeScript properly. Avoid unnecessary use of `any`.

Use Pydantic schemas for backend request validation.

Keep API endpoints, business logic and data-access responsibilities separated as the application grows.

Never hardcode sensitive credentials.

Do not pretend a feature works when it is only a visual placeholder.

---

## 7. USER EXPERIENCE AND PRODUCT BEHAVIOUR

The developer should be able to create a smart link through a straightforward form.

The form should support:

- Application name.
- Android download URL.
- iOS download URL.
- Custom slug.

The system should validate the supplied information before creating a link.

After successful creation, display:

- Application name.
- Generated smart URL.
- Copy-link action.
- Share-link action.
- Link management actions.

The developer should be able to view their created links in a dashboard.

### Visitor experience

When someone opens a generated link:

1. The system identifies the visitor's platform.
2. It retrieves the corresponding smart-link configuration.
3. It displays an appropriate branded intermediate page.
4. It provides a clear download button.
5. The button opens the relevant application store destination.

For unsupported devices, display a useful fallback page instead of showing an error.

The intermediate page should display the application name and a clear download action.

Do not confuse the Duo Link dashboard with the application-branded download page.

They serve different purposes.

---

## 8. PLATFORM DETECTION

Implement platform detection carefully.

The initial implementation can use the visitor's User-Agent information.

Expected behaviour:

- Android → Android destination.
- iPhone/iPad → iOS destination.
- Other platforms → fallback experience.

Important technical limitations:

- Operating-system detection does not establish whether an application is installed.
- Do not claim that Duo Link can detect installed applications.
- Do not implement automatic app opening as an assumed capability.
- Apple Universal Links and Android App Links require additional developer-side configuration and are outside the initial MVP.

Keep the detection logic isolated so it can be improved later.

---

## 9. BACKEND FUNCTIONALITY

Build the FastAPI backend to support the following logical operations.

### Create a link

POST `/api/v1/links`

Accept the application name, Android URL, iOS URL and custom slug.

Validate the input and create a link.

### List links

GET `/api/v1/links`

Return the available smart links.

### Retrieve one link

GET `/api/v1/links/{id}`

Return a particular link.

### Update a link

PATCH `/api/v1/links/{id}`

Allow supported fields to be updated.

### Delete a link

DELETE `/api/v1/links/{id}`

Delete the selected link.

### Resolve a public link

GET `/api/v1/links/resolve/{slug}`

Retrieve the configuration associated with a public slug.

The frontend can use this information to render the branded download experience.

Use appropriate HTTP status codes and meaningful error responses.

Prevent duplicate slugs.

Validate URLs and only accept safe HTTP/HTTPS destinations.

Do not expose internal errors or sensitive information to visitors.

---

## 10. FRONTEND FUNCTIONALITY

Build the frontend around the existing Next.js App Router structure.

The frontend should eventually support:

- Dashboard.
- Create-link interface.
- Link listing and management.
- Edit-link interface.
- Branded download page.
- Login and registration interfaces.

For the initial demo:

Authentication is not real yet.

Login and registration can exist as interface demonstrations, but do not implement fake security or pretend users are authenticated.

The Create Account action should navigate to the dashboard for demonstration purposes if that is the agreed demo behaviour.

Do not add a real authentication provider until explicitly approved.

---

## 11. API INTEGRATION

The frontend and backend are separate applications.

Create a clean API communication layer on the frontend.

Do not scatter hardcoded backend URLs across components.

Use an environment variable for the backend base URL.

For example:

`NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`

Configure FastAPI CORS correctly for the local frontend origin.

Handle:

- Loading states.
- Success states.
- Validation errors.
- Network errors.
- Empty states.

Do not rely on mock data once real API integration has been implemented.

---

## 12. SECURITY AND RELIABILITY

Even though this is a local demo, follow sensible engineering practices.

- Validate all backend inputs.
- Validate URL formats.
- Prevent malformed slugs.
- Handle missing links.
- Handle duplicate slugs.
- Avoid unsafe redirects.
- Do not trust frontend validation alone.
- Keep environment variables out of Git.
- Return meaningful error responses.
- Avoid exposing stack traces to normal API consumers.

---

## 13. TESTING REQUIREMENTS

Test the application as features are implemented.

At minimum, verify:

1. The backend starts successfully.
2. The frontend starts successfully.
3. A smart link can be created.
4. Invalid URLs are rejected.
5. Duplicate slugs are rejected.
6. Created links can be retrieved.
7. Links can be edited.
8. Links can be deleted.
9. Android detection selects the Android destination.
10. iOS detection selects the iOS destination.
11. Unsupported platforms receive a fallback.
12. Missing or invalid slugs produce a proper not-found experience.

Use appropriate unit and integration tests.

Do not claim a test passed unless it was actually executed.

---

## 14. IMPLEMENTATION STRATEGY

Do not attempt to build the entire platform in one uncontrolled operation.

Work in the following phases.

### Phase 0 — Repository audit

Inspect the existing project.

Identify what is already working, what is missing and what needs correction.

Provide a short technical assessment.

### Phase 1 — Backend foundation

Complete the FastAPI application structure.

Establish configuration, API routing, validation and health checks.

Verify the backend independently.

### Phase 2 — Core smart-link logic

Implement creation, retrieval, updating, deletion, slug validation and platform-resolution logic.

Use the approved persistence approach.

Test the endpoints.

### Phase 3 — Frontend foundation

Inspect the existing frontend and implement the required application structure without destroying existing working pages.

### Phase 4 — Frontend and backend integration

Connect the dashboard and forms to the real API.

Remove temporary mock behaviour where real functionality replaces it.

### Phase 5 — Public download experience

Implement the branded intermediate page and platform-specific download actions.

Test the Android, iOS and unsupported-device experiences.

### Phase 6 — Quality assurance

Test the complete user journey from creating a link to opening it as a visitor.

Fix errors before declaring the demo complete.

---

## 15. BUILDING ADVISER NOTES — READ CAREFULLY

These instructions are important.

**A. Do not over-engineer.**

Duo Link is currently an MVP. Avoid microservices, complex event systems, Redis, Kubernetes, unnecessary abstractions and advanced infrastructure.

Build what the product actually needs.

**B. Simplicity is a product requirement.**

The visitor should not need to understand routing, operating systems or technical configurations.

The developer should be able to create a smart link without a complicated process.

**C. Separate responsibilities.**

The frontend handles presentation and user interaction.

The backend handles validation, link management and core business logic.

Do not put important business rules exclusively in the frontend.

**D. Think about future scalability without building for imaginary traffic.**

Use clean boundaries that allow PostgreSQL, authentication, analytics and additional features to be introduced later.

Do not build those future features prematurely.

**E. Avoid fake functionality.**

A button that looks functional but does nothing is not a completed feature.

Every implemented action must have an actual working behaviour or be clearly labelled as a placeholder.

**F. Protect the existing work.**

Inspect before editing. Reuse existing code where sensible.

Do not delete working files simply to impose your preferred architecture.

**G. Explain important decisions.**

When selecting a library, architecture or implementation approach, briefly explain why.

If there is a simpler or more reliable alternative, discuss it.

**H. Keep the developer informed.**

After every implementation phase:

- List files created.
- List files modified.
- Explain what was implemented.
- Explain how to run it.
- Explain how to test it.
- Report outstanding problems.
- Identify the next logical phase.

Do not silently move into a major new phase without reporting the result.

---

## 16. FIRST ACTION — DO NOT SKIP

Start with Phase 0: Repository audit.

Do not immediately generate the entire application.

First inspect the repository and report:

1. Current project structure.
2. Frontend implementation status.
3. Backend implementation status.
4. Existing dependencies.
5. Missing or incomplete files.
6. Any errors or architectural problems.
7. Recommended implementation order.

Then identify the safest next implementation step.

If a critical product or architecture decision is missing, ask one focused question rather than inventing a requirement.

Your objective is to turn Duo Link into a genuinely functional, maintainable local demo through controlled implementation.

**Start by auditing the existing repository.**