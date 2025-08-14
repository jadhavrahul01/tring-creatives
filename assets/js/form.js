// Modal Elements
var modal = document.getElementById("myModal");
var bellBtn = document.getElementById("openModal");
var span = document.getElementsByClassName("close")[0];

// Open modal function
function openModal() {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
}

// Close modal function
function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        resetForm();
    }, 400);
}

// Event Listeners for opening
if (bellBtn) {
    bellBtn.onclick = openModal;
}

// ✅ Event delegation for ALL target buttons/links
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

// Close events
span.onclick = closeModal;
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
};
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Reset form
function resetForm() {
    document.getElementById('contactForm').reset();
    hideAllErrors();
    $('#successMessage').hide();
    $('#loadingDiv').hide();
    $('#formContainer').show();
    $('#submitBtn').prop('disabled', false).removeClass('loading');
    $('.form-control').removeClass('error');
}

// Hide all error messages
function hideAllErrors() {
    $('.error-message').hide();
}

// Show error message
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
    const phone = $('#phone').val().trim();
    const service = $('#service').val().trim();
    const message = $('#message').val().trim();

    if (name === '') {
        showError('name', 'Name is required.');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long.');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showError('email', 'Email is required.');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
    }

    if (phone === '') {
        showError('phone', 'Phone number is required.');
        isValid = false;
    } else if (!/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone)) {
        showError('phone', 'Please enter a valid phone number.');
        isValid = false;
    }

    if (service === '') {
        showError('service', 'Service is required.');
        isValid = false;
    } else if (service.length < 2) {
        showError('service', 'Service must be at least 2 characters long.');
        isValid = false;
    }

    if (message === '') {
        showError('message', 'Message is required.');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters long.');
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

        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            service: $('#service').val().trim(),
            message: $('#message').val().trim()
        };

        $.ajax({
            url: 'mail.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            timeout: 10000,
            success: function (response) {
                $('#loadingDiv').hide();
                console.log('AJAX Response:', response);

                if (response.status === 'success') {
                    // Show success message
                    $('#successMessage').show();
                    $('#contactForm')[0].reset();

                    console.log('Form submitted successfully, redirecting in 2 seconds...');
                    // Wait 2 seconds, then redirect
                    setTimeout(() => {
                        // Direct redirect to thank you page using root-relative path
                        const redirectUrl = window.location.origin + '/thank-you.html';
                        console.log('Redirecting to:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 2000);
                } else {
                    // Show error and restore form
                    $('#formContainer').show();
                    $('#submitBtn').removeClass('loading').prop('disabled', false);
                    alert('Error: ' + (response.message || 'Something went wrong.'));
                }
            },
            error: function (xhr, status, error) {
                $('#loadingDiv').hide();
                $('#formContainer').show();
                $('#submitBtn').removeClass('loading').prop('disabled', false);

                let errorMessage = 'Network error. Please try again.';
                if (status === 'timeout') {
                    errorMessage = 'Request timeout. Please try again.';
                }
                alert(errorMessage);
            }
        });
    });

    // Real-time validation
    $('#name').on('blur keyup', function () {
        const val = $(this).val().trim();
        if (val && val.length < 2) {
            showError('name', 'Name must be at least 2 characters long.');
        } else {
            $('#nameError').hide();
            $(this).removeClass('error');
        }
    });

    $('#email').on('blur keyup', function () {
        const val = $(this).val().trim();
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val && !pattern.test(val)) {
            showError('email', 'Please enter a valid email address.');
        } else {
            $('#emailError').hide();
            $(this).removeClass('error');
        }
    });

    $('#phone').on('blur keyup', function () {
        const val = $(this).val().trim();
        const indianPhoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

        if (val && !indianPhoneRegex.test(val)) {
            showError('phone', 'Please enter a valid phone number.');
        } else {
            $('#phoneError').hide();
            $(this).removeClass('error');
        }
    });

    $('#service').on('blur keyup', function () {
        const val = $(this).val().trim();
        if (val && val.length < 2) {
            showError('service', 'Service must be at least 2 characters long.');
        } else {
            $('#serviceError').hide();
            $(this).removeClass('error');
        }
    });

    $('#message').on('blur keyup', function () {
        const val = $(this).val().trim();
        if (val && val.length < 10) {
            showError('message', 'Message must be at least 10 characters long.');
        } else {
            $('#messageError').hide();
            $(this).removeClass('error');
        }
    });
});