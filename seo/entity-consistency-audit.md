# Radiance Clinics Entity Consistency Audit

Checked: 2026-10-04

## Approved identity

- Official clinic name: Radiance Skin & Hair Clinics
- Approved short name: Radiance Clinics
- Medical authority: Dr. Satyarth Prakash
- Experience statement: 20+ years
- Primary phone: +91 92383 21888
- Secondary phone: +91 92381 22550
- Primary location context: Nayapalli / IRC Village, Bhubaneswar, Odisha

The official name is used in organisation and clinic structured data. The shorter name is retained for navigation, compact interface labels and natural copy.

## Contact and email

- Current public email: radiance.clinics@gmail.com
- Domain-email status: `DOMAIN_EMAIL_SETUP_REQUIRED`
- DNS finding: the domain MX points to `mail.radianceclinics.com`, but that hostname did not resolve to an A record during this check.

No domain inbox has been invented or published. Configure and test a real clinic-controlled mailbox before replacing the current contact address.

## Official social profiles

- YouTube: https://youtube.com/@radianceclinics
- Instagram: https://instagram.com/radianceskinandhairclinic
- Facebook: https://facebook.com/RadianceSkinandHairClinics

The YouTube channel URL is stored without marketing query parameters. Dr. Satyarth Prakash's LinkedIn URL is labelled as a professional profile and is not represented as a clinic company profile.

## Automated controls

`npm run seo:ownership` checks the central entity facts, rejects visible 30+ years claims, rejects tracked YouTube channel URLs and verifies that each governed topic has one canonical owner.
