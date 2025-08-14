// Modal Elements
var modal = document.getElementById("myModal");
var bellBtn = document.getElementById("openModal");
var span = document.getElementsByClassName("close")[0];

// Open modal
function openModal() {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
}

// Close modal
function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        resetForm();
    }, 400);
}

// Open modal triggers
if (bellBtn) {
    bellBtn.onclick = openModal;
}
document.addEventListener("click", function (e) {
    if (
        e.target.closest(".btn-contact") ||
        e.target.closest(".btn-hear-from-us") ||
        e.target.closest(".footer-contact-link")
    ) {
        e.preventDefault();
        openModal();
    }
});

// Close modal triggers
span.onclick = closeModal;
window.onclick = function (event) {
    if (event.target === modal) closeModal();
};
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// Reset form
function resetForm() {
    $('#contactForm')[0].reset();
    hideAllErrors();
    $('#successMessage').hide();
    $('#loadingDiv').hide();
    $('#formContainer').show();
    $('#submitBtn').prop('disabled', false).removeClass('loading');
    $('.form-control').removeClass('error');
}

// Hide all errors
function hideAllErrors() {
    $('.error-message').hide();
}

// Show field error
function showError(fieldId, message) {
    $('#' + fieldId + 'Error').text(message).show();
    $('#' + fieldId).addClass('error');
}

// Validation
function validateForm() {
    let isValid = true;
    hideAllErrors();
    $('.form-control').removeClass('error');

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const company_name = $('#company_name').val().trim();
    const phone = $('#phone').val().trim();
    const service = $('#service').val().trim();
    const message = $('#message').val().trim();

    if (name === '' || name.length < 2) {
        showError('name', name === '' ? 'Name is required.' : 'Name must be at least 2 characters long.');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || !emailPattern.test(email)) {
        showError('email', email === '' ? 'Email is required.' : 'Please enter a valid email address.');
        isValid = false;
    }

    if (company_name === '' || company_name.length < 2) {
        showError('company_name', company_name === '' ? 'Company name is required.' : 'Company name must be at least 2 characters long.');
        isValid = false;
    }

    if (phone === '' || !/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone)) {
        showError('phone', phone === '' ? 'Phone number is required.' : 'Please enter a valid phone number.');
        isValid = false;
    }

    if (service === '' || service.length < 2) {
        showError('service', service === '' ? 'Service is required.' : 'Service must be at least 2 characters long.');
        isValid = false;
    }

    return isValid;
}

// Form submission
$(document).ready(function () {
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        $('#submitBtn').addClass('loading').prop('disabled', true);
        $('#loadingDiv').show();
        $('#formContainer').hide();

        const formData = $('#contactForm').serialize(); // sends form as x-www-form-urlencoded

        $.ajax({
            url: 'mail.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            timeout: 10000,
            success: function (response) {
                $('#loadingDiv').hide();
                if (response.status === 'success') {
                    $('#successMessage').show();
                    $('#contactForm')[0].reset();
                    setTimeout(() => closeModal(), 3000);
                } else {
                    $('#formContainer').show();
                    showErrorMessage(response.message || 'Something went wrong.');
                }
            },
            error: function (xhr, status) {
                $('#loadingDiv').hide();
                $('#formContainer').show();
                showErrorMessage(status === 'timeout' ? 'Request timeout. Please try again.' : 'Network error. Please try again.');
            },
            complete: function () {
                $('#submitBtn').removeClass('loading').prop('disabled', false);
            }
        });
    });

    function showErrorMessage(msg) {
        $('<div class="form-global-error">' + msg + '</div>')
            .css({ color: 'red', marginTop: '10px', textAlign: 'center' })
            .appendTo('#formContainer')
            .delay(4000).fadeOut();
    }
});
