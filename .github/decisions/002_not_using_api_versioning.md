## Not using API versioning

**Author:** Alejandro Barrera Aponte <abarreraaponte@icloud.com>
**Date:** 2024-09-19
**Title:** Not using API Versioning

**Summary:**

This document outlines the decision to avoid using API versioning (e.g., `/api/v1`, `/api/v2`) in the project.

**Description:**

Versioning will be done at the whole system level, not at the API level within the same system.
While API versioning is a common practice to manage breaking changes, we have decided to adopt a different approach for the following reasons:

* **Forced Strategic Thinking:** By avoiding versioning, we are compelled to think strategically about breaking changes from the very beginning. This encourages careful planning and consideration of potential future impacts. The absence of versioning forces us to thoroughly evaluate how new features or changes might affect existing consumers. This promotes a more proactive and user-centric approach to development.
* **Advance Notifications:** To facilitate smooth transitions, we will send out timely notifications to consumers well in advance of any major changes or updates. This allows them to prepare and update their applications accordingly. We will leverage Container Images and other techniques for progressive and gradual version upgrades when required.

**Alternatives Considered:**

* **Traditional API Versioning:** While this is a common approach, it can lead to increased complexity (greater surface area) and maintenance overhead.

**Impact:**

This decision may initially require more effort and coordination to ensure smooth transitions between API versions. However, in the long run, it is expected to lead to a more streamlined and maintainable API, as well as a stronger relationship with consumers.

**Revision History:**

* None