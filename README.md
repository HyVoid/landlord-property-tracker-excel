# Property Operations Hub

**A lightweight property management control center for tracking tenants, lease renewals, insurance deadlines, maintenance costs, and operational follow-ups across small property portfolios.**

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool Type](https://img.shields.io/badge/Type-Property%20Operations%20Tracker-orange.svg)
![Excel](https://img.shields.io/badge/Excel-Microsoft%20365%20%7C%202021%2B-217346.svg)

**Stop managing properties through scattered notes and memory. Keep tenant records, maintenance history, upcoming deadlines, and operational responsibilities in one place — with a lightweight, reusable tracking framework.**

> **Access the Tool**
>
> No signup. No installation. Free to use.
>
> - 🌐 **[Open in Browser](YOUR_BROWSER_VERSION_URL)** — Access the web-based version without installing software.
> - 📥 **[Download Excel Version](YOUR_EXCEL_DOWNLOAD_URL)** — Use the offline workbook for permanent records, operational history, and recurring property management.
>
> The Excel edition is designed for Microsoft 365 and Excel 2021 or later.

---

## What It Helps You Track

Property Operations Hub brings together the operational information that small property portfolios frequently struggle to maintain consistently.

- **Insurance and inspection deadlines** — See which properties have upcoming insurance renewals, overdue policies, or scheduled compliance inspections.
- **Tenant occupancy and lease renewals** — Identify occupied and vacant properties, monitor lease expiration dates, and prepare renewal conversations before contracts end.
- **Maintenance costs and property history** — Track repair frequency, contractor assignments, outstanding work orders, and cumulative maintenance spending by property.
- **Tenant communication and outstanding commitments** — Preserve communication history, record follow-up actions, and identify unresolved tenant requests.
- **Operational risks and daily priorities** — Consolidate overdue items, upcoming deadlines, unresolved maintenance, and tenant follow-ups into actionable lists.
- **Property-level operational health** — Identify which properties require attention based on maintenance frequency, spending thresholds, and outstanding operational issues.

## Quick Start Workflow

The workbook follows a simple operating model: configure the rules once, maintain the source records, and let the system calculate the operational status automatically.

**1. Configure the operating rules**

Start with the `Settings` sheet.

Set the base currency, exchange rate, insurance warning period, inspection warning period, lease renewal threshold, maintenance cost limits, and other operating parameters.

These settings control the calculations throughout the workbook.

**2. Enter existing property and tenant information**

Add property records to `Properties` and tenant records to `Tenants`.

Existing information can be copied from spreadsheets or exported records. Enter property identifiers, addresses, lease dates, contact information, and relevant operational notes.

**3. Record daily operational activities**

Use `Interactions` to document tenant conversations and outstanding commitments.

Use `Maintenance Log` to record repair requests, contractor assignments, completion dates, and costs.

**4. Review the results and refresh periodically**

Open `Dashboard` for the overall operating picture and `Alerts` for specific items requiring action.

Calculations update automatically when source records or operating parameters change. Continue adding new records as properties, tenants, and maintenance activities evolve.

Set the rules once. Maintain the records. Review the risks. Follow up before small operational issues become expensive problems.

---

## Why I Built This

Small property portfolios often have a surprisingly difficult information-management problem.

A landlord managing five to twenty properties may know every tenant personally, remember which contractor handles plumbing, and keep track of insurance renewals through emails, calendars, spreadsheets, and handwritten notes.

That approach works until information becomes fragmented or responsibility changes hands.

The problem is not necessarily a lack of information. It is the absence of a consistent way to connect information to the next operational decision.

For example, a property may have three separate maintenance records, an upcoming insurance renewal, and an unresolved tenant complaint. Each record looks manageable individually. But without a property-level view, the owner may not recognize that the same property is accumulating operational risks.

A similar problem occurs with tenant communication. A contractor may have completed a repair, but the tenant still needs confirmation. Closing the maintenance task does not automatically close the communication commitment.

I designed this workbook as a form of **productized reasoning**: a reusable framework that turns recurring property-management questions into structured records, automatic checks, and action lists.

Instead of relying on memory to answer questions such as:

- Which property needs attention today?
- Which lease should be discussed before expiration?
- Which repair requests are still unresolved?
- Where is maintenance spending becoming unusually high?
- What commitments were made to tenants but have not been completed?

The workbook makes these questions part of a repeatable operating process.

The objective is not to replace a professional property management platform. It is to make small-scale property operations more organized, traceable, and easier to hand over.

## Common Property Management Problems This Solves

| Problem | Without This Tool | With This Tool |
|---|---|---|
| Missed insurance and inspection deadlines | Renewal dates remain buried in individual documents or calendar reminders. | Upcoming and overdue deadlines appear in a consolidated warning list. |
| Unexpected tenant turnover | Lease expiration is discovered too late to coordinate renewal or replacement tenants. | Remaining lease days and renewal priorities are visible before expiration. |
| Uncontrolled maintenance spending | Repair costs are recorded separately, making repeated failures and cumulative spending difficult to recognize. | Maintenance frequency and cumulative costs are summarized by property. |
| Lost tenant commitments | Conversations and promises remain in messages or personal memory. | Every interaction has a recorded follow-up action and completion status. |
| Unresolved contractor work | Repair requests remain open without a clear overview of elapsed time or responsible contractors. | Outstanding work orders are consolidated with contractor details and delay indicators. |
| Difficult property handovers | Important property knowledge depends on the previous operator. | Property records, tenant history, maintenance notes, and outstanding tasks provide a structured handover reference. |

## Who This Is For

Property Operations Hub is designed for:

- Individual landlords managing several residential or vacation rental properties.
- Families coordinating a small portfolio of rental properties.
- Small property operators who need consistent tenant and maintenance records without adopting a complex management platform.
- Property owners preparing to delegate daily responsibilities or transfer operational knowledge to another person.

It is particularly useful when the portfolio is large enough that personal memory and scattered spreadsheets become unreliable, but not large enough to justify a full enterprise property management system.

**Who this is not designed for:** Large property management companies requiring multi-user access controls, automated rent collection, accounting integrations, tenant portals, or real-time Airbnb and Booking.com synchronization.

No spreadsheet expertise needed. Open the browser version and start tracking immediately, or use the Excel workbook for offline operational records.

## About

I build lightweight business trackers and decision-support tools for operational situations where too many moving parts are difficult to manage through memory and disconnected records.

The central question behind each tool is simple: **What information needs to be available in one place to make the next operational decision confidently?**

Property Operations Hub is one example of this approach. It turns recurring property management activities into a structured, reusable operating framework without introducing the complexity of a full enterprise system.

---

## Workbook Architecture

Property Operations Hub is structured as a seven-sheet Excel workbook. Each sheet has a defined operational role, and data moves from manually maintained records through formula-driven calculations into alerts and management views.

The architecture separates four functional layers:

| Layer                  | Worksheets                        | Primary responsibility                                                                              |
| ---------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Global Configuration   | `Settings`                        | Centralise operating parameters, thresholds, currency settings, and status definitions              |
| Master Data            | `Properties`, `Tenants`           | Maintain property and tenant records as the workbook's reference data                               |
| Operational Records    | `Interactions`, `Maintenance Log` | Record tenant communications, follow-up commitments, maintenance activity, contractors, and costs   |
| Monitoring & Reporting | `Alerts`, `Dashboard`             | Identify exceptions, prioritise outstanding work, and present portfolio-level operating information |

### Data Flow

The workbook follows a controlled data flow:

```
                    Settings
                       |
          Global Parameters & Status Rules
                       |
          +------------+-------------+
          |            |             |
      Properties    Tenants     Maintenance Log
          |            |             |
          |       Interactions       |
          |            |             |
          +------------+-------------+
                       |
                Alerts Engine
                       |
                  Dashboard
```

1\. Global configuration

`Settings` provides shared parameters to the other worksheets, including:

- The current reporting date.
- Base currency symbol and maintenance-cost conversion rate.
- Insurance, inspection, and lease-renewal warning periods.
- High-cost maintenance and recurring-repair thresholds.
- Urgent deadline threshold.
- Recent communication display period.
- Annual maintenance budget threshold per property.
- Standardised operational status labels.

Changing a parameter in `Settings` is intended to update the calculations that reference it, rather than requiring users to edit individual formulas.

2\. Master data relationships

`Properties` maintains the property register and acts as the reference source for property IDs and names.

`Tenants` links each tenant to a property through the property ID. Lease dates determine the tenant's current status and renewal countdown.

`Maintenance Log` also references the property ID, allowing maintenance records to be associated with the relevant property.

`Interactions` references the tenant ID, allowing communication records to be connected to tenant and property information.

3\. Operational monitoring

The `Alerts` worksheet scans the underlying records for:

- Insurance policies that are approaching expiry or overdue.
- Upcoming or overdue property inspections.
- Lease renewals requiring attention.
- Maintenance work orders that have not been completed.

It is designed as a formula-generated action list rather than another manual data-entry register.

4\. Management reporting

`Dashboard` consolidates the operational data into six portfolio-level indicators, a property-level risk overview, and a recent communication and follow-up list.

## Workbook Sheet Reference

### 1. `Settings` — Global Configuration

Configuration layer · Central parameter management

The `Settings` worksheet is the control centre for the workbook. It avoids distributing operational thresholds and status definitions across multiple formulas.

| Cell / Range | Parameter                                 | Default / Description                       |
| ------------ | ----------------------------------------- | ------------------------------------------- |
| `C2`         | Current Reference Date                    | `=TODAY()`                                  |
| `C3`         | Base Currency Symbol                      | User-defined, such as `$`, `¥`, `€`, or `£` |
| `C4`         | Currency Conversion Rate                  | `1.0000`                                    |
| `C5`         | Insurance Expiry Warning Days             | `45`                                        |
| `C6`         | Property Inspection Warning Days          | `30`                                        |
| `C7`         | Lease Renewal Warning Days                | `60`                                        |
| `C8`         | High-Cost Maintenance Threshold           | `500.00`                                    |
| `C9`         | Recurring Maintenance Frequency Threshold | `3`                                         |
| `C10`        | Urgent Deadline Threshold                 | `15`                                        |
| `C11`        | Recent Communication Display Period       | `30`                                        |
| `C12`        | Annual Maintenance Budget per Property    | `3,000.00`                                  |

The status dictionary is maintained in `Settings!G2:G10`.

| Cell  | Status Value | Usage                                       |
| ----- | ------------ | ------------------------------------------- |
| `G2`  | `在租`         | Active tenancy                              |
| `G3`  | `空置`         | Vacant property or historical tenant status |
| `G4`  | `已完成`        | Completed maintenance work order            |
| `G5`  | `处理中`        | Maintenance work in progress                |
| `G6`  | `待处理`        | Communication requiring follow-up           |
| `G7`  | `已闭环`        | Communication follow-up completed           |
| `G8`  | `正常`         | No warning condition                        |
| `G9`  | `即将到期`       | Approaching deadline                        |
| `G10` | `已逾期`        | Past deadline                               |

These status values are part of the workbook's calculation logic. If users change them, corresponding data-validation lists and formulas must remain consistent.

### 2. `Properties` — Property Register

Master data layer · Property-level operating records

The property register stores the core information required to monitor each property.

| Column | Field                                  | Input / Formula | Purpose                                                     |
| ------ | -------------------------------------- | --------------- | ----------------------------------------------------------- |
| A      | Property ID                            | Manual          | Unique property reference                                   |
| B      | Property Name                          | Manual          | Readable property name                                      |
| C      | Property Address                       | Manual          | Physical location                                           |
| D      | Property Type / Specification          | Manual          | Bedrooms, bathrooms, area, and other specifications         |
| E      | Insurance Expiry Date                  | Manual          | Current insurance policy expiry                             |
| F      | Next Inspection Date                   | Manual          | Next planned compliance or property inspection              |
| G      | Handover & Compliance Notes            | Manual          | Property-specific operating and handover information        |
| H      | Current Occupancy Status               | Formula         | Identifies whether the property is occupied or vacant       |
| I      | Insurance Days Remaining               | Formula         | Calculates the remaining time before insurance expiry       |
| J      | Insurance Warning Status               | Formula         | Returns normal, approaching expiry, or overdue              |
| K      | Inspection Days Remaining              | Formula         | Calculates the remaining time before the next inspection    |
| L      | Inspection Warning Status              | Formula         | Returns normal, approaching inspection, or overdue          |
| M      | Historical Maintenance Count           | Formula         | Counts maintenance work orders associated with the property |
| N      | Total Maintenance Cost (Base Currency) | Formula         | Aggregates maintenance expenditure                          |
| O      | Maintenance Health Assessment          | Formula         | Flags recurring maintenance or budget-related risk          |

Business purpose

This worksheet turns the property list into an operating register. Instead of relying on separate calendars and personal notes, users can review occupancy, insurance, inspection schedules, and maintenance history in one place.

### 3. `Tenants` — Tenant Register

Master data layer · Tenant and lease records

The tenant register connects occupancy information with lease deadlines and communication follow-ups.

| Column | Field                              | Input / Formula | Purpose                                               |
| ------ | ---------------------------------- | --------------- | ----------------------------------------------------- |
| A      | Tenant ID                          | Manual          | Unique tenant reference                               |
| B      | Tenant Name                        | Manual          | Tenant's primary contact name                         |
| C      | Property ID                        | Manual          | Links the tenant to a property                        |
| D      | Contact Details                    | Manual          | Phone number, email, and relevant contact information |
| E      | Move-in Date                       | Manual          | Lease start or actual occupancy date                  |
| F      | Lease Renewal / Move-out Date      | Manual          | Current lease end or planned move-out date            |
| G      | Monthly Rent (Base Currency)       | Manual          | Contractual monthly rent                              |
| H      | Special Requirements & Commitments | Manual          | Special arrangements and tenant-specific commitments  |
| I      | Property Name                      | Formula         | Retrieves the linked property name                    |
| J      | Current Tenant Status              | Formula         | Determines whether the tenant is active or historical |
| K      | Days Until Renewal                 | Formula         | Calculates the remaining lease period                 |
| L      | Renewal Warning Status             | Formula         | Identifies approaching or overdue renewal dates       |
| M      | Pending Communication Follow-ups   | Formula         | Counts communication records still marked as pending  |

Business purpose

The tenant register helps operators identify upcoming lease decisions before they become urgent. It also preserves tenant-specific arrangements that might otherwise be lost when operational responsibility changes hands.

### 4. `Interactions` — Communication Log

Operational records layer · Communication history and follow-up tracking

This worksheet records tenant communications and the actions that arise from them.

| Column | Field                   | Input / Formula | Purpose                                         |
| ------ | ----------------------- | --------------- | ----------------------------------------------- |
| A      | Interaction ID          | Manual          | Unique communication record                     |
| B      | Interaction Date        | Manual          | Date of communication                           |
| C      | Tenant ID               | Manual          | Links the record to a tenant                    |
| D      | Communication Channel   | Manual          | Phone, SMS, WhatsApp, WeChat, email, or meeting |
| E      | Communication Summary   | Manual          | Main request, complaint, or discussion          |
| F      | Follow-up Action Plan   | Manual          | Next action or commitment                       |
| G      | Follow-up Status        | Manual          | Pending or completed                            |
| H      | Tenant Name             | Formula         | Retrieves the tenant name                       |
| I      | Related Property ID     | Formula         | Retrieves the tenant's property ID              |
| J      | Days Since Interaction  | Formula         | Calculates elapsed time                         |
| K      | Recent Interaction Flag | Formula         | Identifies recent or still-pending records      |

Business purpose

The communication log provides an operating memory for tenant-related work. It records not only what was discussed, but also what was promised and whether the follow-up has been completed.

A communication record remains relevant when it is either within the configured recent-period window or still marked as pending.

### 5. `Maintenance Log` — Maintenance Work Orders

Operational records layer · Repair history, contractors, and costs

The maintenance log provides a consistent record of repair activity across the property portfolio.

| Column | Field                              | Input / Formula | Purpose                                               |
| ------ | ---------------------------------- | --------------- | ----------------------------------------------------- |
| A      | Maintenance Work Order ID          | Manual          | Unique maintenance reference                          |
| B      | Reported Date                      | Manual          | Date the issue was reported or identified             |
| C      | Property ID                        | Manual          | Links the work order to a property                    |
| D      | Fault Area / Category              | Manual          | Plumbing, HVAC, electrical, roofing, appliances, etc. |
| E      | Problem Description & Review Notes | Manual          | Issue details, repair approach, and review notes      |
| F      | Contractor & Contact Details       | Manual          | Responsible contractor and phone number               |
| G      | Maintenance Status                 | Manual          | In progress or completed                              |
| H      | Completion Date                    | Manual          | Actual completion and acceptance date                 |
| I      | Original Maintenance Cost          | Manual          | Original invoice or repair amount                     |
| J      | Property Name                      | Formula         | Retrieves the linked property name                    |
| K      | Maintenance Cost (Base Currency)   | Formula         | Converts the original cost using the configured rate  |
| L      | Maintenance Duration (Days)        | Formula         | Calculates completed or outstanding duration          |
| M      | Cost Exception Flag                | Formula         | Identifies work orders exceeding the cost threshold   |
| N      | Work Order Closure Code            | Formula         | Identifies completed and outstanding work orders      |

Business purpose

This worksheet creates a maintenance history that can be reviewed by property, contractor, fault category, and cost.

It also supports two distinct types of monitoring:

- Cost monitoring: identify individual work orders that exceed the configured high-cost threshold.
- Operational monitoring: identify unresolved work orders and track how long they have remained open.

### 6. `Alerts` — Automated Alert Engine

Monitoring layer · Formula-generated exception lists

`Alerts` is designed as a formula-only worksheet. It does not require users to enter operational records manually.

It contains four independent alert sections:

| Section                 | Source            | Information Displayed                                              | Operating Purpose                       |
| ----------------------- | ----------------- | ------------------------------------------------------------------ | --------------------------------------- |
| Insurance Alerts        | `Properties`      | Property ID, name, expiry date, remaining days, urgency            | Prevent missed insurance renewals       |
| Inspection Alerts       | `Properties`      | Property ID, name, inspection date, remaining days, urgency        | Track upcoming and overdue inspections  |
| Lease Renewal Alerts    | `Tenants`         | Tenant ID, name, property, remaining days, priority                | Start renewal or vacancy planning early |
| Outstanding Maintenance | `Maintenance Log` | Work order, property, fault category, contractor, duration warning | Follow up on unresolved repairs         |

The alert sections are intended to sort deadline-related items by remaining days, allowing the most urgent items to appear first.

### 7. `Dashboard` — Property Operations Dashboard

Management layer · Portfolio-level visibility and daily action review

The dashboard provides a consolidated view of the portfolio.

Six key performance indicators

| KPI                            | Cell | What It Measures                                                   |
| ------------------------------ | ---- | ------------------------------------------------------------------ |
| Total Pending Tasks            | `B4` | Combined operational follow-ups                                    |
| Upcoming Deadlines             | `C4` | Insurance, inspection, and lease items approaching their deadlines |
| Overdue High-Risk Items        | `D4` | Insurance, inspection, and lease items past their deadlines        |
| Outstanding Maintenance Orders | `E4` | Maintenance work orders still in progress                          |
| Vacant Properties              | `F4` | Properties currently identified as vacant                          |
| Total Maintenance Expenditure  | `G4` | Aggregated maintenance costs in the configured base currency       |

Property-level operating overview

The area beginning at `A8` displays:

- Active property IDs and names.
- Outstanding property-level risk counts.
- An operational health indicator.

Recent communication and follow-up stream

The area beginning at `H8` displays selected interaction records, including:

- Communication date.
- Tenant name.
- Related property.
- Communication summary.
- Follow-up action.
- Follow-up status.

This gives the operator a single place to review recent tenant activity and outstanding commitments without manually searching the full communication log.


## The Business Logic & Methodology

Property Operations Hub applies a lightweight property operations control model to a recurring problem faced by small landlords and family property operators: essential information is spread across separate records, messages, calendars, and personal memory.

A property can appear financially stable while important operational tasks are being missed. Insurance may be close to expiry, an inspection may be overdue, a lease may need renewal, or a maintenance request may remain unresolved after a contractor has been contacted.

The workbook addresses these problems by connecting property records, tenant records, communication history, and maintenance activity into one operating workflow.

### 1. Property-Level Risk Monitoring

Method: Deadline-based exception monitoring

The workbook calculates the remaining days before insurance expiry, property inspections, and lease deadlines. It then compares those values against configurable warning periods.

This changes the operating approach from checking dates manually to reviewing a prioritised exception list.

| Business Problem                                     | Method                                           | Operational Result                                         |
| ---------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| Insurance renewals are forgotten                     | Expiry countdown and warning thresholds          | Identify policies requiring attention                      |
| Inspections are missed                               | Inspection countdown and deadline classification | Surface upcoming and overdue inspections                   |
| Lease renewals begin too late                        | Lease-end countdown and renewal warnings         | Provide time to contact tenants and plan occupancy         |
| Operators cannot quickly identify problem properties | Property-level risk aggregation                  | Direct attention toward properties with outstanding issues |

### 2. Tenant Relationship Continuity

Method: Tenant master data + interaction history + follow-up status

A tenant relationship is not limited to a name, phone number, and monthly rent. It also includes requests, complaints, arrangements, and commitments made during previous conversations.

The workbook connects interaction records to tenant IDs, then retrieves the associated tenant and property information.

The follow-up status distinguishes between a conversation that has been recorded and an action that has actually been completed.

This supports a more reliable handover when another family member or property operator takes responsibility.

### 3. Maintenance Cost & Recurrence Analysis

Method: Work-order history + cost normalisation + exception thresholds

Maintenance records are associated with individual properties. Original repair costs are converted into a common reporting currency using a configurable exchange rate.

The workbook then supports three levels of maintenance review:

1. Individual work-order cost exceptions.
2. Accumulated maintenance expenditure by property.
3. Recurring maintenance frequency and property-level health assessment.

This helps operators distinguish an isolated repair from a property that may be developing a repeated maintenance problem.

The maintenance assessment is a screening mechanism, not a professional building-condition inspection or a full lifecycle asset-management model.

### 4. Exception-Driven Daily Management

Method: Formula-generated alerts + KPI aggregation + property health indicators

The `Alerts` sheet extracts records requiring attention. The `Dashboard` then presents a compact management view of portfolio-level indicators and recent activity.

Instead of opening every property record and checking every deadline individually, the operator can begin with the exceptions and drill down into the underlying record.

The resulting operating loop is:

```
Property & Tenant Records
          |
          v
Communication & Maintenance Logs
          |
          v
Deadline / Cost / Status Calculations
          |
          v
      Alerts Sheet
          |
          v
    Dashboard Review
          |
          v
   Contact / Repair / Renew
          |
          v
       Update Records
```

### 5. Why an Excel-Based Control Model?

For a small portfolio, a full property management platform may introduce more setup and operating complexity than the business requires.

Property Operations Hub uses familiar spreadsheet workflows to provide:

- A central property and tenant register.
- Structured communication and maintenance records.
- Repeatable deadline monitoring.
- Basic maintenance cost visibility.
- A management dashboard.
- A format that can be reviewed, maintained, and handed over by non-technical operators.

It is designed as a practical operating layer for small property portfolios, not as a replacement for accounting software, property management platforms, booking systems, or specialist compliance services.

## Daily Operating Workflow

The recommended daily workflow follows five steps.

### Step 1 — Update Source Records

Use the manual input areas of the four operational worksheets.

| Situation                  | Worksheet         | Required Action                                                  |
| -------------------------- | ----------------- | ---------------------------------------------------------------- |
| New tenant signs a lease   | `Tenants`         | Add a tenant record and link it to a Property ID                 |
| Lease is renewed           | `Tenants`         | Update the lease renewal / move-out date                         |
| Tenant makes a request     | `Interactions`    | Record the communication and required follow-up                  |
| Follow-up is completed     | `Interactions`    | Change the follow-up status to `已闭环`                             |
| A property requires repair | `Maintenance Log` | Create a work order and set its status to `处理中`                  |
| Repair is completed        | `Maintenance Log` | Enter the completion date and cost, then set the status to `已完成` |
| Insurance is renewed       | `Properties`      | Update the insurance expiry date                                 |
| Inspection is completed    | `Properties`      | Update the next inspection date                                  |

### Step 2 — Allow Formulas to Recalculate

The workbook uses native Excel formulas. Under automatic calculation mode, changes to source data should update the corresponding formula outputs.

If results do not update, check Excel's calculation mode. Pressing `F9` can force a recalculation.

### Step 3 — Check Data Quality

Review the formula-generated columns for missing matches or unexpected values.

Typical warning signs include:

- `未匹配物业`
- `未知租户`
- Unexpected blank results.
- Incorrect deadline countdowns.
- Formula errors.

Correct the source record before relying on the downstream alert or dashboard.

### Step 4 — Review Alerts and Dashboard

Open `Alerts` to review the detailed action lists.

Then open `Dashboard` to review:

- Total pending tasks.
- Upcoming deadlines.
- Overdue items.
- Outstanding maintenance orders.
- Vacant properties.
- Total maintenance expenditure.
- Property-level health indicators.
- Recent tenant communication and pending follow-ups.

### Step 5 — Export for Reporting or Handover

For a periodic update or operational handover:

1. Open `Dashboard` or `Alerts`.
2. Select landscape page orientation.
3. Adjust the print area and scaling to fit the required report width.
4. Export the worksheet as PDF.
5. Share the report with the relevant family member or operator.

The PDF is a snapshot of the workbook at the time of export. It does not replace the underlying Excel records.

## Data Maintenance Guidelines

### Preserve the Input / Formula Separation

Only edit the manual input columns:

- `Properties`: A:G
- `Tenants`: A:H
- `Interactions`: A:G
- `Maintenance Log`: A:I

Do not type into formula-generated columns or delete the formula starting cells.

### Add Records Within the Designed Ranges

The workbook's predefined ranges are:

| Worksheet         | Designed Data Range |
| ----------------- | ------------------- |
| `Properties`      | Rows 2–200          |
| `Tenants`         | Rows 2–500          |
| `Interactions`    | Rows 2–1,000        |
| `Maintenance Log` | Rows 2–1,000        |

The first column's record ID is used to identify populated records. Always enter the corresponding ID when creating a new record.

If the workbook needs to exceed these ranges, formulas, data validation, alert extraction, and dashboard references must be extended and tested together.

### Maintain the Settings Sheet

Use `Settings` to change:

- Reporting reference date.
- Base currency symbol.
- Currency conversion rate.
- Insurance and inspection warning periods.
- Lease renewal warning period.
- High-cost maintenance threshold.
- Recurring maintenance frequency threshold.
- Urgent deadline threshold.
- Recent communication display period.
- Annual property maintenance budget threshold.

Do not change the standard status dictionary unless the corresponding dropdown lists and formula comparisons are updated consistently.

## Troubleshooting

### Q1. Why does a formula cell show `#SPILL!`?

Likely cause: another value, space, or merged cell is blocking the dynamic array output range.

Resolution:

1. Select the cell showing `#SPILL!`.
2. Review the highlighted spill range.
3. Identify and clear the blocking cell.
4. Preserve the formula in the designated starting cell.
5. Confirm that the output range is no longer obstructed.

Do not delete the formula starting cell when clearing a spill obstruction.

### Q2. Why does a new maintenance or interaction record not appear on the Dashboard?

Likely causes:

- The record ID in column A is missing.
- The Property ID or Tenant ID does not match an existing record.
- The record is outside the predefined formula range.
- Excel is using manual calculation mode.
- The record does not meet the Dashboard's recent or pending display conditions.

Resolution: check the record ID, linked reference ID, status, date, and calculation mode.

### Q3. Why does a completed item still appear in an alert list?

Likely cause: the manually entered status does not exactly match the standard status dictionary.

For example, `已完成 ` with a trailing space is not the same text as `已完成`.

Resolution: use the dropdown list rather than manually typing the status value. Check the corresponding status definition in `Settings!G2:G10`.

### Q4. Why does a date appear as a five-digit number?

Excel stores dates as serial numbers. If a date cell is formatted as General or Number, the underlying serial value may appear instead of a readable date.

Resolution: select the affected cells and apply an appropriate date format, such as `YYYY-MM-DD`.

### Q5. Why does a cell show `#####`?

The column may be too narrow to display the value.

Resolution: widen the column or use AutoFit Column Width.

### Q6. Why is the maintenance health indicator inconsistent with the annual budget?

Likely cause: the property-level maintenance aggregation may include historical costs from multiple years, while the configured budget is described as an annual limit.

Resolution: verify whether the maintenance-cost calculation is filtered to the relevant budget year. If it is a lifetime total, do not interpret the resulting comparison as an annual budget variance.

## Compatibility & System Requirements

Dynamic array support required

The workbook architecture relies on modern Excel functions and dynamic array behaviour.

| Application             | Compatibility                                                   |
| ----------------------- | --------------------------------------------------------------- |
| Microsoft 365 Excel     | Required / intended environment                                 |
| Excel 2021              | Supported target environment                                    |
| Excel 2024 and later    | Supported target environment                                    |
| Recent WPS Spreadsheets | Conditional — must support the required dynamic array functions |
| Excel 2019              | Not supported for the complete formula architecture             |
| Excel 2016              | Not supported for the complete formula architecture             |

The workbook uses functions including `FILTER`, `SORT`, and `XLOOKUP`. Older Excel versions that do not support these functions cannot run the complete calculation model as designed.

For WPS, verify the actual installed version and test the formulas before relying on it for daily operations.

## Scope & Limitations

Property Operations Hub is designed for a small portfolio of approximately 5–20 properties, including:

- Small vacation rental portfolios.
- Family-owned property portfolios.
- Individual landlords managing multiple rental properties.
- Small operators who need a structured handover process.

It is not designed to replace:

- Enterprise property management systems.
- Full accounting or bookkeeping platforms.
- Automated rent collection or bank payment systems.
- Airbnb, Booking.com, or other OTA integrations.
- Real-time booking and availability synchronisation.
- Multi-user, high-frequency concurrent operational systems.
- Specialist property inspection or regulatory compliance services.

The workbook provides a structured record and monitoring process. It does not independently verify the accuracy of manually entered data, guarantee regulatory compliance, or execute maintenance and tenant-management actions.

## Access & Distribution

This repository's source implementation describes the Excel workbook architecture and its operating logic.

Excel Version: `YOUR_EXCEL_DOWNLOAD_URL`

Browser Version: `YOUR_BROWSER_VERSION_URL`

Replace these placeholders with verified release links before publishing. The implementation source used to prepare this README does not establish a deployed browser application or a downloadable workbook URL. Do not publish the placeholders as if they were working downloads.

The browser version should only be listed as available after an actual browser application has been deployed and tested. Likewise, the Excel link should point to the released workbook rather than the implementation specification.

## Other Tools in This Series

Explore other lightweight business decision and operations tools in the Theseus Workshop collection:

- Inventory management and reconciliation.
- Cost estimation and project control.
- Financial planning and profitability analysis.
- Operational tracking and reporting.

See the [Theseus Workshop](https://theseusworkshop.com) for the available projects.

## License

Add the repository's actual license before publishing this section.

If the project is intended to use Apache License 2.0, include the full Apache-2.0 license text in a root-level `LICENSE` file and identify the project accordingly. Do not label the repository as Apache-2.0 licensed until that file is present.

