document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Mobile Bottom Navigation
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      mobileNavItems.forEach((navItem) => {
        navItem.classList.remove("active");
      });

      // Add active class to clicked item
      this.classList.add("active");

      // If it's a hash link, handle smooth scrolling
      const href = this.getAttribute("href");
      if (href.startsWith("#") && href !== "#") {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          const mobileNavHeight =
            document.querySelector(".mobile-bottom-nav").offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Update active nav item based on scroll position
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    // Get all sections
    const sections = document.querySelectorAll("section");

    // Find the current section
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    // Update active nav item
    if (currentSection) {
      mobileNavItems.forEach((item) => {
        item.classList.remove("active");
        const href = item.getAttribute("href");
        if (href === `#${currentSection}`) {
          item.classList.add("active");
        }
      });
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const mobileNavHeight = document.querySelector(".mobile-bottom-nav")
          ? document.querySelector(".mobile-bottom-nav").offsetHeight
          : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

  // Hero Slider
  const heroSlides = document.querySelectorAll(".hero-slide");
  const sliderDots = document.querySelectorAll(".slider-dot");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Hide all slides
    heroSlides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Remove active class from all dots
    sliderDots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show the selected slide and activate corresponding dot
    heroSlides[index].classList.add("active");
    sliderDots[index].classList.add("active");

    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= heroSlides.length) {
      next = 0;
    }
    showSlide(next);
  }

  // Initialize slider
  if (heroSlides.length > 0) {
    // Start automatic slideshow
    slideInterval = setInterval(nextSlide, 5000);

    // Add click event to dots
    sliderDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // Tour Modal
  const $ = window.jQuery; // Declare $ as jQuery
  $("#tourModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget);
    const tourName = button.data("tour");
    const tourPrice = button.data("price");
    const modal = $(this);

    // Set tour details based on the selected tour
    modal.find("#modalTourTitle").text(tourName);
    modal.find("#modalTourPrice").text(`$${tourPrice} per person`);

    // Set the book now button link
    modal.find("#modalBookBtn").attr("onclick", `bookTour('${tourName}')`);

    // Set tour image
    let tourImage = "";
    switch (tourName) {
      case "Stone Town Tour":
        tourImage = "assets/img/tour/tour_stone_town_forozani.png";
        setTourDetails(
          modal,
          [
            "UNESCO World Heritage site tour",
            "Visit historical sites like the Old Fort",
            "Explore local markets",
            "Visit the former Slave Market",
            "See the birthplace of Freddie Mercury",
          ],
          "Explore the historical and cultural heart of Zanzibar with our guided Stone Town tour. Walk through narrow alleys, visit historical buildings, and learn about the island's rich history including its past as a major trading hub and the dark history of the slave trade.",
          [
            "Professional English-speaking guide",
            "Bottled water",
            "Entrance fees to historical sites",
            "Hotel pickup and drop-off (Stone Town area)",
          ]
        );
        break;
      case "Safari Blue":
        tourImage =
          "assets/img/tour/safari_blue_in_zanzibar.jpg";
        setTourDetails(
          modal,
          [
            "Sail on a traditional dhow",
            "Snorkeling in coral reefs",
            "Swim in crystal clear waters",
            "Delicious seafood BBQ lunch",
            "Visit Kwale Island",
          ],
          "Safari Blue is the ultimate sea adventure in Zanzibar. Sail on a traditional dhow to pristine snorkeling spots where you can explore vibrant coral reefs and marine life. Enjoy a delicious seafood BBQ lunch on a beautiful sandbank and relax on the stunning beaches of Kwale Island.",
          [
            "Professional guides",
            "Snorkeling equipment",
            "Seafood BBQ lunch",
            "Fresh tropical fruits",
            "Soft drinks and water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Prison Island Tour":
        tourImage =
          "assets/img/tour/prison island tour.jpg";
        setTourDetails(
          modal,
          [
            "Visit the giant Aldabra tortoises",
            "Learn about the island's history",
            "Swimming and snorkeling opportunity",
            "Beautiful boat ride from Stone Town",
          ],
          "Prison Island, also known as Changuu Island, is home to giant Aldabra tortoises and was once used as a prison for rebellious slaves. Enjoy a scenic boat ride from Stone Town, meet the century-old tortoises, learn about the island's fascinating history, and enjoy swimming and snorkeling in the crystal clear waters surrounding the island.",
          [
            "Boat transfer",
            "Professional guide",
            "Entrance fees",
            "Snorkeling equipment",
            "Bottled water",
            "Hotel pickup and drop-off (Stone Town area)",
          ]
        );
        break;
      case "Spice Tour":
        tourImage =
          "assets/img/tour/spice tour.jpg";
        setTourDetails(
          modal,
          [
            "Visit working spice plantations",
            "See, smell, and taste various spices",
            "Learn about traditional medicinal uses",
            "Taste seasonal tropical fruits",
            "Optional visit to Kidichi Persian Baths",
          ],
          'Discover why Zanzibar is known as the "Spice Island" on this aromatic tour of local spice plantations. See, smell, and taste various spices such as cloves, cinnamon, black pepper, and nutmeg while learning about their cultivation and traditional uses in cooking and medicine. Your guide will also demonstrate how to prepare some local spice mixes.',
          [
            "Professional English-speaking guide",
            "Spice tastings",
            "Seasonal fruit tastings",
            "Bottled water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Jozani Forest":
        tourImage =
          "assets/img/tour/jozani forest.jpg";
        setTourDetails(
          modal,
          [
            "See the endemic Zanzibar Red Colobus monkeys",
            "Guided walk through the forest",
            "Visit the mangrove boardwalk",
            "Learn about local conservation efforts",
          ],
          "Jozani Forest is home to the rare and endemic Zanzibar Red Colobus monkey, found only in Zanzibar. Take a guided walk through this protected forest to observe these endangered primates in their natural habitat. You'll also explore the mangrove boardwalk and learn about the unique ecosystem and conservation efforts in the area.",
          [
            "Entrance fees to Jozani Forest",
            "Professional guide",
            "Bottled water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Sea Turtle Nungwi":
        tourImage =
          "assets/img/tour/sea turtle nungwi.jpg";
        setTourDetails(
          modal,
          [
            "Visit the Mnarani Marine Turtle Conservation Pond",
            "Swim with rescued sea turtles",
            "Learn about conservation efforts",
            "Beautiful beach time in Nungwi",
          ],
          "Visit the Mnarani Marine Turtle Conservation Pond in Nungwi, a community-based project that rescues and rehabilitates sea turtles. You'll have the opportunity to swim with these magnificent creatures in their natural environment and learn about the conservation efforts to protect these endangered species. The tour also includes time to enjoy the beautiful beaches of Nungwi.",
          [
            "Entrance fee to the turtle sanctuary",
            "Professional guide",
            "Swimming with turtles experience",
            "Bottled water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Dolphin Kizimkazi":
        tourImage =
          "assets/img/tour/Dolphin tour.jpg";
        setTourDetails(
          modal,
          [
            "Boat trip to spot wild dolphins",
            "Swimming with dolphins opportunity",
            "Snorkeling at coral reefs",
            "Visit to Kizimkazi village",
          ],
          "Head to the southern village of Kizimkazi for an exciting dolphin watching adventure. Board a traditional wooden boat and sail to areas where dolphins are commonly spotted. If lucky, you'll have the opportunity to swim alongside these intelligent marine mammals in their natural habitat. The tour also includes snorkeling at beautiful coral reefs and a visit to the historic Kizimkazi village with its ancient mosque.",
          [
            "Boat trip",
            "Professional guide",
            "Snorkeling equipment",
            "Bottled water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Snorkelling Blue Lagoon":
        tourImage =
          "assets/img/tour/safari-blue-snorkel-1.jpg";
        setTourDetails(
          modal,
          [
            "Snorkel in the famous Blue Lagoon",
            "See colorful coral reefs and tropical fish",
            "Visit multiple snorkeling spots",
            "Relax on pristine beaches",
          ],
          "Experience the underwater paradise of Zanzibar's Blue Lagoon, known for its crystal clear turquoise waters and vibrant marine life. Snorkel among colorful coral reefs and tropical fish in this protected marine area. The tour includes visits to multiple snorkeling spots and time to relax on pristine beaches.",
          [
            "Boat transfer",
            "Professional guide",
            "Snorkeling equipment",
            "Fresh fruits",
            "Bottled water",
            "Hotel pickup and drop-off",
          ]
        );
        break;
      case "Nakupenda Sand Bank":
        tourImage =
          "assets/img/tour/nakupenda_love_island.jpg";
        setTourDetails(
          modal,
          [
            "Visit the stunning Nakupenda sandbank",
            "Relax on pristine white sand",
            "Swimming in crystal clear waters",
            "Delicious seafood BBQ lunch",
            "Snorkeling opportunity",
          ],
          'Nakupenda, which means "I love you" in Swahili, is a stunning sandbank that appears during low tide near Stone Town. Sail on a traditional dhow to this natural wonder where you can relax on pristine white sand surrounded by crystal clear turquoise waters. Enjoy swimming, snorkeling, and a delicious seafood BBQ lunch prepared fresh on the sandbank.',
          [
            "Boat transfer",
            "Professional guide",
            "Seafood BBQ lunch",
            "Snorkeling equipment",
            "Fresh fruits",
            "Soft drinks and water",
            "Hotel pickup and drop-off (Stone Town area)",
          ]
        );
        break;
      case "Serengeti Safari":
        tourImage =
          "assets/img/safari/Serengeti-National-Park-zebra.jpg";
        setTourDetails(
          modal,
          [
            "Game drives in the world-famous Serengeti",
            "Opportunity to see the Big Five",
            "Witness the Great Migration (seasonal)",
            "Comfortable accommodation in the park",
            "Professional safari guide",
          ],
          "Experience the world-famous Serengeti National Park, home to the greatest concentration of wildlife in Africa. Enjoy game drives through vast plains where you can spot lions, elephants, giraffes, zebras, and many more animals in their natural habitat. If you visit during the right season, you might witness the spectacular Great Migration, where millions of wildebeest and zebra traverse the plains in search of fresh grazing.",
          [
            "Park entrance fees",
            "Professional safari guide",
            "Game drives in 4x4 vehicle",
            "Accommodation as per itinerary",
            "All meals during safari",
            "Bottled water",
            "Airport/hotel pickup and drop-off",
          ]
        );
        break;
      case "Ngorongoro Crater":
        tourImage =
          "assets/img/safari/Ngorongoro-Crater.jpg";
        setTourDetails(
          modal,
          [
            "Game drive in the Ngorongoro Crater",
            "Opportunity to see the Big Five",
            "Breathtaking views from the crater rim",
            "Visit to Maasai village (optional)",
            "Professional safari guide",
          ],
          'Explore the UNESCO World Heritage site of Ngorongoro Crater, often called the "Garden of Eden" due to its incredible biodiversity. Descend into this massive volcanic caldera for a game drive where you can spot lions, elephants, rhinos, and many other animals in a relatively small area. The crater\'s walls create a natural enclosure for wildlife, making it one of the best places in Tanzania for guaranteed wildlife sightings.',
          [
            "Park entrance fees",
            "Professional safari guide",
            "Game drives in 4x4 vehicle",
            "Accommodation as per itinerary",
            "All meals during safari",
            "Bottled water",
            "Airport/hotel pickup and drop-off",
          ]
        );
        break;
      case "Mikumi National Park":
        tourImage =
          "assets/img/safari/1-day-mikumi-national-park.jpg";
        setTourDetails(
          modal,
          [
            "Game drives in Mikumi National Park",
            "Spot lions, zebras, wildebeest, and elephants",
            "Beautiful landscapes of the Mkata Floodplain",
            "Professional safari guide",
          ],
          "Visit Tanzania's fourth-largest national park, located just a few hours from Dar es Salaam. Mikumi National Park offers a more accessible safari experience with its open horizons and abundant wildlife. The Mkata Floodplain is often compared to the famous Serengeti Plains and is home to large herds of zebra, wildebeest, buffalo, and elephants, as well as predators like lions and leopards.",
          [
            "Park entrance fees",
            "Professional safari guide",
            "Game drives in 4x4 vehicle",
            "Accommodation as per itinerary",
            "All meals during safari",
            "Bottled water",
            "Airport/hotel pickup and drop-off",
          ]
        );
        break;
      case "Mount Kilimanjaro":
        tourImage =
          "assets/img/safari/kilimanjaro.jpg";
        setTourDetails(
          modal,
          [
            "Climb Africa's highest mountain (5,895m)",
            "Multiple route options (Machame, Marangu, Lemosho, etc.)",
            "Professional mountain guides and porters",
            "Stunning views from the summit",
            "Certificate of achievement",
          ],
          "Mount Kilimanjaro is the highest mountain in Africa and the highest free-standing mountain in the world. This iconic trek takes you through five distinct climate zones, from rainforest to alpine desert to arctic summit. Our experienced guides will lead you safely to Uhuru Peak, where you'll experience the breathtaking sunrise views from the 'Roof of Africa'.",
          [
            "Professional mountain guides",
            "Porters and cooks",
            "All meals during the climb",
            "Camping equipment (tents, sleeping mats)",
            "Park fees and permits",
            "Airport transfers",
            "Pre and post-climb accommodation",
          ]
        );
        break;
      case "Mount Meru":
        tourImage =
          "assets/img/safari/Meru mountain.jpg";
        setTourDetails(
          modal,
          [
            "Climb Tanzania's second-highest mountain (4,566m)",
            "Less crowded alternative to Kilimanjaro",
            "Stunning views of Mount Kilimanjaro",
            "Rich wildlife viewing opportunities",
            "Professional mountain guides",
          ],
          "Mount Meru is Tanzania's second-highest mountain and a perfect warm-up for Kilimanjaro or a fantastic trek in its own right. Located in Arusha National Park, the trek offers beautiful scenery and the opportunity to see wildlife such as giraffes, buffaloes, and various monkey species. The summit offers spectacular views of Mount Kilimanjaro and the Rift Valley.",
          [
            "Professional mountain guides",
            "Armed ranger (required in Arusha National Park)",
            "Porters and cooks",
            "All meals during the climb",
            "Accommodation in mountain huts",
            "Park fees and permits",
            "Airport transfers",
          ]
        );
        break;
      default:
        tourImage =
          "assets/img/safari/serengeti_baloon.jpg";
    }

    modal.find("#modalTourImg").attr("src", tourImage);
  });

  function setTourDetails(modal, highlights, description, includes) {
    // Set highlights
    const highlightsList = modal.find("#modalTourHighlights");
    highlightsList.empty();
    highlights.forEach((highlight) => {
      highlightsList.append(`<li>${highlight}</li>`);
    });

    // Set description
    modal.find("#modalTourDescription").text(description);

    // Set includes
    const includesList = modal.find("#modalTourIncludes");
    includesList.empty();
    includes.forEach((item) => {
      includesList.append(`<li>${item}</li>`);
    });
  }

  // Review System
  const reviewForm = document.getElementById("reviewForm");
  const submitReviewBtn = document.getElementById("submitReview");

  // Handle star rating selection
  if (document.querySelector(".rating-input")) {
    const stars = document.querySelectorAll(".rating-input i");
    const ratingInput = document.getElementById("reviewRating");

    function highlightStars(rating) {
      stars.forEach((star) => {
        const starRating = star.getAttribute("data-rating");
        if (starRating <= rating) {
          star.classList.remove("far");
          star.classList.add("fas");
        } else {
          star.classList.remove("fas");
          star.classList.add("far");
        }
      });
    }

    stars.forEach((star) => {
      star.addEventListener("mouseover", function () {
        const rating = this.getAttribute("data-rating");
        highlightStars(rating);
      });

      star.addEventListener("mouseout", () => {
        const rating = ratingInput.value;
        highlightStars(rating);
      });

      star.addEventListener("click", function () {
        const rating = this.getAttribute("data-rating");
        ratingInput.value = rating;
        highlightStars(rating);
      });
    });
  }

  // Handle review submission
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", () => {
      if (reviewForm.checkValidity()) {
        const name = document.getElementById("reviewName").value;
        const email = document.getElementById("reviewEmail").value;
        const tour = document.getElementById("reviewTour").value;
        const rating = document.getElementById("reviewRating").value;
        const reviewText = document.getElementById("reviewText").value;

        if (rating === "0") {
          showNotification("Please select a rating", "error");
          return;
        }

        // In a real application, this would send the review to a server
        // For now, we'll just show a success message and close the modal
        showNotification(
          "Thank you for your review! It will be published after moderation.",
          "success"
        );

        // Save review to localStorage for demonstration purposes
        saveReview({
          name,
          email,
          tour,
          rating,
          reviewText,
          date: new Date().toISOString(),
        });

        // Close the modal
        $("#reviewModal").modal("hide");

        // Reset the form
        reviewForm.reset();
        if (document.querySelector(".rating-input")) {
          const stars = document.querySelectorAll(".rating-input i");
          stars.forEach((star) => {
            star.classList.remove("fas");
            star.classList.add("far");
          });
        }
      } else {
        reviewForm.reportValidity();
      }
    });
  }

  // Save review to localStorage
  function saveReview(review) {
    const reviews = JSON.parse(localStorage.getItem("tourReviews") || "[]");
    reviews.push(review);
    localStorage.setItem("tourReviews", JSON.stringify(reviews));
  }

  // Form submission with AJAX
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic form validation
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
      const tour = document.getElementById("tour").value;

      if (!name || !email || !message) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

      // Prepare form data
      const formData = new FormData(contactForm);

      // Submit form using fetch API
      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          // Success - clear form and show success message
          contactForm.reset();
          showNotification(
            "Thank you! Your message has been sent successfully.",
            "success"
          );

          // Save submission to localStorage for admin dashboard
          const submission = {
            id: "c" + Date.now(),
            date: new Date().toISOString(),
            name: name,
            email: email,
            subject: tour !== "General Inquiry" ? tour : "General Inquiry",
            message: message,
            tour: tour,
            status: "unread",
            notes: [],
          };

          saveSubmission(submission, "contact");

          // Add this line to send email notification
          sendEmailNotification("contact", submission);
        })
        .catch((error) => {
          // Error - show error message
          showNotification(
            "Oops! There was a problem sending your message. Please try again.",
            "error"
          );
          console.error("Error:", error);
        })
        .finally(() => {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    });
  }

  // Save submission to localStorage for admin dashboard
  function saveSubmission(submission, type) {
    let submissions = [];

    if (type === "contact") {
      submissions = JSON.parse(
        localStorage.getItem("contactSubmissions") || "[]"
      );
      submissions.push(submission);
      localStorage.setItem("contactSubmissions", JSON.stringify(submissions));
    } else if (type === "booking") {
      submissions = JSON.parse(
        localStorage.getItem("bookingSubmissions") || "[]"
      );
      submissions.push(submission);
      localStorage.setItem("bookingSubmissions", JSON.stringify(submissions));
    }
  }

  // Add this function to the script.js file, after the saveSubmission function

  // Send email notification for new submissions
  async function sendEmailNotification(type, data) {
    try {
      // Check if email notifications are enabled
      const emailSettings = JSON.parse(
        localStorage.getItem("emailSettings") || "{}"
      );

      if (!emailSettings.enabled) {
        return; // Email notifications are disabled
      }

      // Check if this type of notification is enabled
      if (type === "contact" && !emailSettings.contactEnabled) {
        return;
      }

      if (type === "booking" && !emailSettings.bookingEnabled) {
        return;
      }

      // Send notification to API endpoint
      const response = await fetch(
        "https://your-api-endpoint.com/api/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            data,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to send email notification:", result.error);
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  // Notification function
  window.showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
    }"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 5000);
  };

  // Language switcher
  window.changeLanguage = (lang) => {
    const currentLang = document.getElementById("current-language");
    const langMap = {
      en: "EN",
      fr: "FR",
      pl: "PL",
      sw: "SW",
    };

    if (currentLang) {
      currentLang.textContent = langMap[lang];
    }

    // In a real application, this would load translated content
    // This is just a simulation for demonstration purposes
    showNotification(`Language changed to ${getLanguageName(lang)}`, "success");

    // Save language preference to localStorage
    localStorage.setItem("preferredLanguage", lang);
  };

  function getLanguageName(code) {
    const languages = {
      en: "English",
      fr: "French",
      pl: "Polish",
      sw: "Swahili",
    };
    return languages[code] || "Unknown";
  }

  // Tour booking function
  window.bookTour = (tourName) => {
    // Redirect to booking page with tour pre-selected
    window.location.href = `booking.html?tour=${encodeURIComponent(tourName)}`;
  };

  // Check for URL parameters (for booking page)
  function getUrlParameter(name) {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Pre-select tour if coming from main page
  const tourParam = getUrlParameter("tour");
  if (tourParam && document.getElementById("tourType")) {
    const tourSelect = document.getElementById("tourType");
    for (let i = 0; i < tourSelect.options.length; i++) {
      if (tourSelect.options[i].value === tourParam) {
        tourSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Add CSS for notifications
  const style = document.createElement("style");
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 15px 25px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      z-index: 9999;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification i {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    
    .notification.success {
      background-color: #d4af37;
      color: #212529;
    }
    
    .notification.error {
      background-color: #dc3545;
      color: white;
    }
  `;
  document.head.appendChild(style);

  // Image lazy loading
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }

  // Initialize Bootstrap (if not already initialized)
  let bootstrap = window.bootstrap;
  if (typeof bootstrap === "undefined") {
    bootstrap = {}; // Or load it some other way, e.g., using import
  }

  // Add admin dashboard link to footer
  const footerLinks = document.querySelectorAll(".footer-links");
  if (footerLinks.length > 0) {
    const adminLinkItem = document.createElement("li");
    const adminLink = document.createElement("a");
    adminLink.href = "admin/index.html";
    adminLink.textContent = "Admin Dashboard";
    adminLinkItem.appendChild(adminLink);
    footerLinks[0].appendChild(adminLinkItem);
  }
});

// Check for saved language preference on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  }
});
