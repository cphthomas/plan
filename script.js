document.getElementById('downloadICS').addEventListener('click', () => {
    const pageId = document.body.getAttribute('data-page-id');
    let prodIdValue = `plan./tepedu.dk/${pageId}`;

    const events = document.querySelectorAll('.event');
    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        `PRODID:${prodIdValue}`,
    ];

    // Current time in seconds since the Unix Epoch
    const nowSeconds = Math.floor(Date.now() / 1000);
    // Using the current time to generate a sequence number, assuming updates
    // are not more frequent than every 10 seconds (for example)
    const sequence = Math.floor(nowSeconds / 10);

    const now = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');

    events.forEach((event, index) => {
        const start = event.getAttribute('data-start').replace(/-|:|\.\d\d\d/g, '');
        const end = event.getAttribute('data-end').replace(/-|:|\.\d\d\d/g, '');
        const summary = event.getAttribute('data-summary');
        let description = event.querySelector('.description').innerHTML;

        description = description.replace(/<br\s*\/?>/gi, "")
                                 .replace(/\n/g, "\\n")
                                 .replace(/,/g, "\\,")
                                 .replace(/;/g, "\\;")
                                 .replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, "$2→ $1")
                                 .replace(/\t/g, "")
                                 .replace(/\s+/g, ' ').trim()
                                 .replace(/&rarr;/g, ":");

        const uid = `uid${pageId}${index}@tepedu.dk`;

        icsContent.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            `SEQUENCE:${sequence}`,
            `LAST-MODIFIED:${now}`,
            "END:VEVENT"
        );
    });

    icsContent.push("END:VCALENDAR");
    const blob = new Blob([icsContent.join("\r\n")], {type: "text/calendar"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "events.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
