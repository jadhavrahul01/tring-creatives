// Modal functionality
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

span.onclick = function () {
    closeModal();
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        resetForm();
    }, 400);
}

// Reset form function
function resetForm() {
    document.getElementById('contactForm').reset();
    hideAllErrors();
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').classList.remove('loading');

    // Remove error states
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('error'));
}

// Hide all error messages
function hideAllErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.style.display = 'none');
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('error');
}

// Validate form
function validateForm() {
    let isValid = true;
    hideAllErrors();

    // Remove all error states
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('error'));

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Name validation
    if (name === '') {
        showError('name', 'Name is required.');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long.');
        isValid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showError('email', 'Email is required.');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
    }

    // Message validation
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

        if (!validateForm()) {
            return;
        }

        // Show loading state
        $('#submitBtn').addClass('loading').prop('disabled', true);
        $('#loadingDiv').show();
        $('#formContainer').hide();

        // Prepare form data
        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            message: $('#message').val().trim()
        };

        // Simulate AJAX request (replace with your actual endpoint)
        setTimeout(() => {
            // Simulate success (replace with actual AJAX call)
            const success = Math.random() > 0.3; // 70% success rate for demo

            if (success) {
                $('#loadingDiv').hide();
                $('#successMessage').show();
                $('#contactForm')[0].reset();

                // Auto close after 3 seconds
                setTimeout(() => {
                    closeModal();
                }, 3000);
            } else {
                $('#loadingDiv').hide();
                $('#formContainer').show(); 
            }

            $('#submitBtn').removeClass('loading').prop('disabled', false);
        }, 2000);


        //Uncomment this for actual AJAX implementation
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

                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                } else {
                    $('#formContainer').show();
                    alert('Error: ' + (response.message || 'Something went wrong. Please try again.'));
                }
            },
            error: function (xhr, status, error) {
                $('#loadingDiv').hide();
                $('#formContainer').show();

                let errorMessage = 'Network error. Please check your connection and try again.';
                if (status === 'timeout') {
                    errorMessage = 'Request timeout. Please try again.';
                }

                alert(errorMessage);
                console.error('AJAX Error:', error);
            },
            complete: function () {
                $('#submitBtn').removeClass('loading').prop('disabled', false);
            }
        });

    });

    // Real-time validation
    $('#name').on('blur keyup', function () {
        const name = $(this).val().trim();
        const nameError = $('#nameError');

        if (name === '') {
            nameError.hide();
            $(this).removeClass('error');
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters long.');
        } else {
            nameError.hide();
            $(this).removeClass('error');
        }
    });

    $('#email').on('blur keyup', function () {
        const email = $(this).val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = $('#emailError');

        if (email === '') {
            emailError.hide();
            $(this).removeClass('error');
        } else if (!emailPattern.test(email)) {
            showError('email', 'Please enter a valid email address.');
        } else {
            emailError.hide();
            $(this).removeClass('error');
        }
    });

    $('#message').on('blur keyup', function () {
        const message = $(this).val().trim();
        const messageError = $('#messageError');

        if (message === '') {
            messageError.hide();
            $(this).removeClass('error');
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters long.');
        } else {
            messageError.hide();
            $(this).removeClass('error');
        }
    });
});

// Escape key to close modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});