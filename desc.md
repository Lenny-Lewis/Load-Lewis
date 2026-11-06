# Project Management System

A website and mobile app that manage final-year student projects from the first proposal to final completion. Students, supervisors, department leaders, and administrators all work in one shared system.

**Current status:** Built and in pre-launch testing. It is not yet live with real users.

## The problem it solves

Final-year projects are often managed through email, paper forms, and spreadsheets. That creates several problems:

- **Lost work:** files and feedback are spread across inboxes, and it's hard to tell which version is current.
- **Little visibility:** students can't easily see where they stand, and departments can't see progress across all projects without asking each supervisor.
- **Uneven workloads:** some supervisors can end up with too many students.
- **Duplicate topics:** similar project ideas are hard to spot by hand.
- **Slow reporting:** completion reports have to be put together manually.

This system gives everyone one place to submit work, review it, track progress, and produce reports.

## Who uses it

| Role | What they do |
|---|---|
| **Student** | Submits a proposal, uploads chapters, and follows their progress |
| **Supervisor** | Reviews students' work, gives feedback, and records marks |
| **Head of Department or Project Coordinator** | A supervisor with extra access to department-wide progress and reports |
| **Administrator** | Manages users, academic periods, departments, and system records |

## What it can do

### Students

- Register with an official institution email and admission number
- Submit a proposal and choose an available supervisor
- Invite one partner to work on the project with them
- Upload five chapters and the full documentation, one stage at a time
- See supervisor decisions, comments, and key dates
- Get in-app and email updates

Students never see their marks, at any stage.

### Supervisors

- See assigned students and work waiting for review
- Approve a proposal or chapter, ask for revisions, or reject it, with comments
- See a proposal's similarity to other projects, along with an estimate of how likely a document is to be AI-written
- Record proposal, documentation, and presentation marks, for a total out of 100
- View and export a completion report for their own students

Each supervisor can hold up to 10 active projects, which keeps workloads balanced.

### Heads of Department and Project Coordinators

- Use everything a supervisor can
- See all students and projects across the system
- View proposal status, milestone summaries, and completion reports

### Administrators

- Create users one at a time or import them from a CSV file
- Send account invitations, change roles, and deactivate or delete accounts
- Set academic periods and proposal submission dates
- Manage departments and programmes
- View the audit log, failed emails, and AI-likelihood overview
- View and export completion reports

### Security and everyday use

- Email verification when registering, and email codes as an extra sign-in check
- Fingerprint sign-in on the mobile app
- The ability to view and sign out of active sessions and manage trusted devices
- Limits on repeated sign-in attempts, plus server-enforced permissions for each role
- Light and dark mode
- A guided tour for first-time users on the website

Push notifications for the mobile app are built, but testing on a phone is still pending.

## How it works from start to finish

1. **Setup:** an administrator adds departments and staff, then opens an academic period with proposal dates.
2. **Registration:** a student creates and verifies an account.
3. **Proposal:** during the open dates, the student submits a proposal, chooses a supervisor, and can invite a partner.
4. **Proposal review:** the supervisor checks the proposal and approves it, asks for revisions, or rejects it.
5. **Chapter work:** after approval, the student uploads Chapter 1. The supervisor reviews it, and approval unlocks the next stage.
6. **Repeat to the end:** the same process continues through Chapters 2–5 and the Full Documentation.
7. **Marks:** the supervisor records the marks, which only staff can see.
8. **Completion:** once all six documents are uploaded and approved, the project counts as complete and appears in the completion report.

### What each review decision means

| Decision | What happens next |
|---|---|
| **Approved** | The work is accepted. For a chapter, the next stage unlocks. |
| **Revision** | The student reads the comments, makes changes, and submits again. |
| **Rejected** | The work isn't accepted. The student reads the comments and submits again. |

## How to use it

### Student

1. Register with your official email and admission number, then enter the code sent to your email.
2. Go to the proposal form while submissions are open, fill it in or attach your proposal, and choose a supervisor.
3. If you have a partner, invite them. They must accept before they can see the project's progress.
4. Wait for the supervisor's decision. You'll get a notification.
5. Once approved, open **Documents** and upload Chapter 1.
6. Read the decision and comments. If asked for a revision or rejected, replace the file. If approved, move on to the next chapter.
7. Continue until the Full Documentation is approved. Follow your status under **Progress**.

### Supervisor

1. Sign in using the account invitation you received.
2. Check **Pending** for work waiting for review.
3. Open the project, read the document, and look at its similarity and AI-likelihood estimates. These are guides, not final judgements.
4. Choose approve, revision, or reject, and add clear comments.
5. Record the marks when they're due.
6. Use the completion report to see which students have finished.

### Head of Department or Project Coordinator

1. Sign in and open **Oversight**.
2. Look through the student and project roster.
3. Check the proposal status and milestone summaries to find projects that have fallen behind.
4. Open the completion report when you need a final list.

### Administrator

1. Sign in on the website.
2. Add departments and programmes.
3. Create an academic period, set its proposal dates, and make it active.
4. Add users one at a time or import a CSV file, then assign the Head of Department and Project Coordinator.
5. Help users with account problems by resending invitations or resetting sign-in checks.
6. Use the audit log and reports to monitor the system.

## Website and mobile app

| Task | Website | Mobile app |
|---|---|---|
| Student work | Yes | Yes |
| Supervisor reviews and marks | Yes | Yes |
| Oversight reports | Yes | Yes |
| Administration | Yes | No, website only |
| Fingerprint sign-in | No | Yes |

An account works on both, and both show the same data.

## How it is built

- **Website:** React and Vite
- **Mobile app:** Expo (React Native)
- **Server:** Node.js and Express
- **Database:** MongoDB
- **File storage:** Cloudflare R2
- **Email:** Brevo

The system is designed for 400–600 students and supervisors. In a local load test, a server limited to 1 CPU kept up with 600 people online at once. This test has not yet been repeated on the live hosting services.

## Estimated cost

All amounts are in US dollars. These are estimates, not invoices. Prices were checked on 6 November 2026 and can change.

### Running cost

Today, every service runs on a free plan, so the current hosting cost is **$0 per month**.

The estimate below is for going live with 400–600 users, using the plans in the project's go-live checklist.

| Service | Plan | Estimated monthly cost | Source |
|---|---|---|---|
| Server hosting (Render) | Standard: 1 CPU, 2 GB RAM | $25 | [Render pricing](https://render.com/pricing) |
| Database (MongoDB Atlas) | Entry-level dedicated cluster | About $60 | [Atlas billing docs](https://www.mongodb.com/docs/atlas/billing/billing-breakdown-optimization/) |
| Website hosting (Vercel) | Hobby or Pro | $0–$20 | [Vercel pricing](https://vercel.com/pricing) |
| File storage (Cloudflare R2) | Pay for what you use | About $1 or less | [R2 pricing](https://developers.cloudflare.com/r2/pricing/) |
| Email (Brevo) | Starter, 5,000 emails | From $9 | [Brevo pricing guide](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans) |
| **Total** | | **About $95–$115 per month** | |

App store fees are separate:

- **Google Play:** [$25 one time](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)
- **Apple Developer Program:** [$99 per year](https://developer.apple.com/programs/enroll/)

**Estimated first-year running cost: about $1,260–$1,500.** That's 12 months of hosting plus both app store fees.

Assumptions and exclusions:

- **Atlas:** MongoDB's [pricing page](https://www.mongodb.com/pricing) shows $56.94 per month for a dedicated cluster, while its docs say about $60. This estimate uses the higher figure.
- **Vercel:** Hobby is free but limited to personal, non-commercial use, so an organisation would likely need Pro.
- **File storage:** the worst case is 600 separate projects each using every upload limit, or about 80 GB. At $0.015 per GB after the first 10 GB, that's about $1 per month.
- **Email:** a busy period could need a larger Brevo plan.
- **Not included:** a custom domain, taxes, support staff, and optional SMS alerts, which depend on usage.

### Build cost

This is what it might cost to hire someone to build a similar system. It is not money that was actually spent.

The estimate assumes **700 hours** of work: one developer working full time for about 17.5 weeks, the length of the project's history from July to November 2026. Actual hours weren't tracked, so this is an upper-end assumption.

| Basis | Hourly rate | Estimated cost |
|---|---|---|
| [Upwork full-stack freelancer rates](https://www.upwork.com/hire/full-stack-developers/) | $16–$35 | $11,200–$24,500 |
| [US median software developer pay, BLS](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm) | $64.44 | About $45,100 |

The US figure is pay only. It also includes QA analysts and testers, and it leaves out employer costs such as benefits.

**Estimated build cost: about $11,000–$45,000**, depending on who is hired and where.
