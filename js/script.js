/**************************************************************
	
	Main Js Activation
	01. Preloader
	02. Menu
	03. Header Shadow 
	04. Pagepiling
	05. Carousels
	06. Forms
	__ End Js Activation

***************************************************************/

(function ($) {
  "use strict";

  /*-------------------------------------------------------------------------------
	  Preloader
	-------------------------------------------------------------------------------*/
  $(window).on("load", function () {
    if ($(".preloader").length) {
      $(".preloader").fadeOut("slow");
    }
  });

  /*-------------------------------------------------------------------------------
	  Menu
	-------------------------------------------------------------------------------*/

  $(".a-nav-toggle, .menu-main a").on("click", function () {
    if ($("html").hasClass("body-menu-opened")) {
      $("html").removeClass("body-menu-opened").addClass("body-menu-close");
      $("#pp-nav").show();
    } else {
      $("html").addClass("body-menu-opened").removeClass("body-menu-close");
      $("#pp-nav").hide();
    }
  });

  /*-------------------------------------------------------------------------------
	  Pagepiling
	-------------------------------------------------------------------------------*/
  const anchors = ["VideoBanner", "StepsGuide", "FillDetails"];
  if ($(".a-pagepiling").length) {
    $(".a-pagepiling").pagepiling({
      scrollingSpeed: 280,
      menu: "#menu, #menuMain",
      anchors,
      loopTop: false,
      loopBottom: true,
      navigation: {
        position: "right",
      },
      onLeave: function () {
        if ($(".slide-dark-footer").hasClass("active")) {
          $("body").addClass("body-copyright-light");
        } else {
          $("body").removeClass("body-copyright-light");
        }
        if ($(".slide-dark-bg").hasClass("active")) {
          $("body").addClass("body-bg-dark");
        } else {
          $("body").removeClass("body-bg-dark");
        }
      },
      afterRender: function () {
        $("#pp-nav a").each(function (index) {
          $(this).attr("aria-label", anchors[index]);
        });
      },
    });
  }
  /*-------------------------------------------------------------------------------
	  Forms
	-------------------------------------------------------------------------------*/

  // Material
  if ($(".a-form-group").length) {
    $(".a-form-group .form-control").each(function () {
      if (
        $(this).val().length > 0 ||
        $(this).attr("placeholder") !== undefined
      ) {
        $(this).closest(".a-form-group").addClass("active");
      }
    });
    $(".a-form-group .form-control").focus(function () {
      $(this).closest(".a-form-group").addClass("active");
    });
    $(".a-form-group .form-control").blur(function () {
      if ($(this).val() == "" && $(this).attr("placeholder") == undefined) {
        $(this).closest(".a-form-group").removeClass("active");
      }
    });
    $(".a-form-group .form-control").change(function () {
      if ($(this).val() == "" && $(this).attr("placeholder") == undefined) {
        $(this).closest(".a-form-group").removeClass("active");
      } else {
        $(this).closest(".a-form-group").addClass("active");
      }
    });
  }
  /*-------------------------------------------------------------------------------
	  Lazy Load Images
	-------------------------------------------------------------------------------*/
  const observer = lozad(); // lazy loads elements with default selector as '.lozad'
  observer.observe();
})($);
