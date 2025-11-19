
$(document).ready(function() {
    console.log('Login page loaded - jQuery ready!');
    const roleDropdown = new bootstrap.Dropdown(document.getElementById('roleDropdown'));
    let selectedRole = '';
    $('.role-option').on('click', function(e) {
        e.preventDefault();
        
        const roleValue = $(this).data('value');
        const roleText = $(this).find('.fw-semibold').text();
        selectedRole = roleValue;
        $('#role').val(roleValue);
        $('#roleText').text(roleText);
        $('#roleDropdown')
            .removeClass('btn-outline-primary')
            .addClass('btn-primary has-selection')
            .find('.bx')
            .removeClass('bx-chevron-down')
            .addClass('bx-chevron-up');
        roleDropdown.hide();
        setTimeout(() => {
            $('#roleDropdown').find('.bx').removeClass('bx-chevron-up').addClass('bx-chevron-down');
        }, 300);
        
        console.log('Role selected:', roleValue);
    });
    $('#roleDropdown').on('show.bs.dropdown', function() {
        $(this).find('.bx').removeClass('bx-chevron-down').addClass('bx-chevron-up');
    });

    $('#roleDropdown').on('hide.bs.dropdown', function() {
        $(this).find('.bx').removeClass('bx-chevron-up').addClass('bx-chevron-down');
    });
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const role = $('#role').val();
        
        console.log('Login attempt:', { email, password, role });

        let isValid = true;
        
        if (!email) {
            showFieldError('#email', 'Email harus diisi');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('#email', 'Format email tidak valid');
            isValid = false;
        } else {
            clearFieldError('#email');
        }
        
        if (!password) {
            showFieldError('#password', 'Password harus diisi');
            isValid = false;
        } else {
            clearFieldError('#password');
        }
        
        if (!role) {
            showFieldError('.role-dropdown', 'Role harus dipilih');
            isValid = false;
        } else {
            clearFieldError('.role-dropdown');
        }
        
        if (!isValid) {
            return;
        }

        const loginBtn = $('.login-btn');
        loginBtn.prop('disabled', true).html('<i class="bx bx-loader-alt bx-spin"></i> Loading...');

        setTimeout(() => {
            if (role === 'admin') {
                console.log('Redirecting to admin.html');
                window.location.href = 'admin.html';
            } else {
                console.log('Redirecting to user.html');
                window.location.href = 'user.html';
            }
        }, 1000);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(selector, message) {
        $(selector).addClass('is-invalid');
        let $feedback = $(selector).next('.invalid-feedback');
        if ($feedback.length === 0) {
            $feedback = $('<div class="invalid-feedback"></div>');
            $(selector).after($feedback);
        }
        $feedback.text(message).show();
    }

    function clearFieldError(selector) {
        $(selector).removeClass('is-invalid');
        $(selector).next('.invalid-feedback').hide();
    }

    $('#email, #password').on('input', function() {
        clearFieldError('#' + $(this).attr('id'));
    });

    $('#email').focus();

    $('#email').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#password').focus();
        }
    });

    $('#password').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#roleDropdown').focus().click();
        }
    });
});