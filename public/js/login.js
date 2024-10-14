document
	.getElementById('loginForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault(); // Prevent the default form submission

		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		try {
			const response = await axios.post('/login', { username, password });
			if (response.data.success) {
				alert('ĐĂNG NHẬP THÀNH CÔNG!');
				// Redirect to the dashboard or another page
				window.location.href = '/';
			} else {
				alert('ĐĂNG NHẬP THẬT BẠI: ' + response.data.message);
			}
		} catch (error) {
			console.error('Error during login:', error);
			alert('Server error. Please try again later.');
		}
	});
