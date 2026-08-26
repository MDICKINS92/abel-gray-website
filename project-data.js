/* Shared project facts used by the homepage, Projects and Residential pages. */
window.ABEL_GRAY_PROJECTS = {
    "pepys-lane": {
        name: "Pepys Lane",
        location: "Slipton, Northamptonshire",
        status: "Completed",
        description: "The conversion of a former public house together with two new detached family homes. The scheme is now complete, with all three properties sold.",
        url: "/pepys-lane"
    },
    "field-view-house": {
        name: "Field View House",
        location: "Paulerspury, Northamptonshire",
        status: "Reserved",
        description: "A private country residence on the edge of Paulerspury, combining natural stone, traditional architecture and a layout designed around modern family living.",
        url: "/field-view-house"
    },
    "lindoe-meadows": {
        name: "Lindoe Meadows",
        location: "Great Addington, Northamptonshire",
        status: "Coming Soon",
        description: "A small collection of individually designed detached homes in the Northamptonshire countryside. Further information will be released as the scheme progresses.",
        url: "/lindoe-meadows"
    },
    "ecl-mews": {
        name: "ECL Mews",
        location: "Bedfordshire",
        status: "Coming Soon",
        description: "Seven homes within a conservation area setting, comprising six new mews style properties and the conversion of an existing building, with private outdoor space and extensive new landscaping.",
        url: "/ecl-mews"
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

        if (status) status.textContent = project.status;
        if (location) location.textContent = project.location;
        if (title) title.textContent = project.name;
        if (description) description.textContent = project.description;
        if (link && link.tagName === "A") link.href = project.url;
    });
})();