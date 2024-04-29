document.addEventListener('DOMContentLoaded', function () {
    var dropdownLinks = document.querySelectorAll('#myDropdown-plan a'); // Select all anchors within the dropdown

    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default anchor behavior
            var targetId = this.getAttribute('href'); // Get the href attribute of the clicked anchor
            var targetElement = document.querySelector(targetId); // Select the target element

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block:'center' }); // Scroll to the target element smoothly
                // targetElement.scrollTop = 0;

            }
        });
    });
});

document.getElementById('about').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the link

    // Get the element to scroll to
    const titleElement = document.getElementById('title');

    // Scroll to the element smoothly
    titleElement.scrollIntoView({ behavior: 'smooth', block:'center' });
});