/* Shared project facts used by the homepage, Projects and Residential pages. */
window.ABEL_GRAY_PROJECTS = {
    "pepys-lane": {
        name: "Pepys Lane",
        location: "Slipton, Northamptonshire",
        status: "Completed",
        description: "The conversion of a former public house together with two new detached family homes. The scheme is now complete, with all three properties sold.",
        homes: "3 homes",
        url: "/pepys-lane",
        seoTitle: "Pepys Lane, Slipton | Abel Gray",
        seoDescription: "Pepys Lane is a completed Abel Gray residential scheme of three homes in Slipton, Northamptonshire.",
        pageHeading: "Pepys Lane, Slipton, Northamptonshire",
        pageSubtitle: "Completed residential scheme of three homes",
        schemaType: "Accommodation"
    },
    "field-view-house": {
        name: "Field View House",
        location: "Paulerspury, Northamptonshire",
        status: "Reserved",
        description: "A Reserved single home at Tews End Lane on the edge of Paulerspury, Northamptonshire.",
        homes: "1 home",
        url: "/field-view-house",
        seoTitle: "Field View House, Paulerspury | Abel Gray",
        seoDescription: "Field View House is a Reserved Abel Gray home at Tews End Lane, Paulerspury, Northamptonshire.",
        pageHeading: "Field View House",
        pageSubtitle: "Tews End Lane, Paulerspury, Northamptonshire",
        schemaType: "House"
    },
    "lindoe-meadows": {
        name: "Lindoe Meadows",
        location: "Great Addington, Northamptonshire",
        status: "Coming Soon",
        description: "A proposed collection of six detached homes in Great Addington, Northamptonshire.",
        homes: "6 detached dwellings",
        bedrooms: "3, 4 & 5 bedroom homes",
        url: "/lindoe-meadows",
        seoTitle: "Lindoe Meadows, Northamptonshire | Abel Gray",
        seoDescription: "Lindoe Meadows is a proposed collection of six detached homes in Great Addington, Northamptonshire.",
        pageHeading: "Lindoe Meadows, Great Addington",
        pageSubtitle: "A collection of six individually designed detached homes in the Northamptonshire countryside.",
        schemaType: "Accommodation"
    },
    "ecl-mews": {
        name: "ECL Mews",
        location: "Bedfordshire",
        status: "Coming Soon",
        description: "A proposed scheme of seven homes in Bedfordshire: six new mews-style homes and one conversion.",
        homes: "7 homes",
        url: "/ecl-mews",
        seoTitle: "ECL Mews, Bedfordshire | Abel Gray",
        seoDescription: "ECL Mews is a proposed Abel Gray scheme of seven homes in Bedfordshire, within a conservation area setting.",
        pageHeading: "ECL Mews, Bedfordshire",
        pageSubtitle: "Seven homes: six new-build mews dwellings and one conversion in a conservation area setting",
        schemaType: "Accommodation"
    }
};

(function () {
    const projects = window.ABEL_GRAY_PROJECTS || {};

    document.querySelectorAll("[data-project-card]").forEach(function (card) {
        const project = projects[card.dataset.projectCard];
        if (!project) return;

        const status = card.querySelector("[data-project-status], .update-date, .development-status span");
        const location = card.querySelector("[data-project-location], .update-location, .project-card-location");
        const title = card.querySelector("[data-project-name], h2, h3");
        const description = card.querySelector("[data-project-description], .project-card-desc, p:not(.project-card-location):not(.update-location):not(.update-date)");
        const link = card.querySelector("[data-project-link], a.card-link, .project-card-link");
        const homes = card.querySelector("[data-project-homes]");

        if (status) status.textContent = project.status;
        if (location) location.textContent = project.location;
        if (title) title.textContent = project.name;
        if (description) description.textContent = project.description;
        if (link && link.tagName === "A") link.href = project.url;
        if (homes && project.homes) homes.textContent = project.homes;
    });

    document.querySelectorAll("[data-project-value]").forEach(function (element) {
        const project = projects[element.dataset.projectId];
        const value = project && project[element.dataset.projectValue];
        if (value) element.textContent = value;
    });

    const pageProject = projects[document.body.dataset.projectPage];
    if (pageProject) {
        document.title = pageProject.seoTitle;
        const description = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (description) description.content = pageProject.seoDescription;
        if (ogTitle) ogTitle.content = pageProject.seoTitle;
        if (ogDescription) ogDescription.content = pageProject.seoDescription;
        const heading = document.querySelector('.page-header h1');
        const subtitle = document.querySelector('.page-header h1 + p');
        if (heading) heading.textContent = pageProject.pageHeading;
        if (subtitle) subtitle.textContent = pageProject.pageSubtitle;
        const schema = document.getElementById('project-schema');
        if (schema) {
            schema.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": pageProject.schemaType,
                "name": pageProject.pageHeading,
                "description": pageProject.seoDescription,
                "url": "https://abelgray.co.uk" + pageProject.url,
                "numberOfRooms": Number.parseInt(pageProject.homes, 10),
                "address": { "@type": "PostalAddress", "addressRegion": pageProject.location.split(', ').pop(), "addressCountry": "GB" }
            });
        }
    }
})();