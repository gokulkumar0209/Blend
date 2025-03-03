import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import axios from "axios";

const server = "http://localhost:8080";
function SignupPage() {
	const [formData, setFormData] = useState({
		username: "",
		fullname: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleChange = (field) => (e) => {
		setFormData({ ...formData, [field]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const url = `${server}/api/auth/signup`;
			const result = await axios.post(url, formData);
			console.log("Hi");

			console.log(result);
			console.log("Hello");
			// Replace this with your signup logic (API call, etc.)
			if (result.status === 201) {
				alert("User registered successfully");
			} else {
				console.log(result);

				setError(result.data.message);
			}
		} catch (error) {
			setError(error.response.data.message);
		}

		// Replace this with your signup logic (API call, etc.)
		console.log("User signed up with data:", formData);
	};

	return (
		<div className="flex bg-black h-screen w-screen">
			<div className="h-full w-1/2 flex justify-center items-center bg-black">
				<h1 className="text-primary font-extrabold text-[400px] border-8 flex justify-center items-center h-[600px] text-center w-[600px] rounded-full border-primary">
					B
				</h1>
			</div>
			<div className="h-full w-1/2 bg-black flex flex-col justify-center items-center">
				<h1 className="text-white text-4xl font-bold mb-8">Join Today</h1>
				<form onSubmit={handleSubmit} className="w-2/3 space-y-4">
					<Input
						label="Username"
						value={formData.username}
						onChange={handleChange("username")}
						required
					/>
					<Input
						label="Full Name"
						value={formData.fullname}
						onChange={handleChange("fullname")}
						required
					/>
					<Input
						label="Email"
						type="email"
						value={formData.email}
						onChange={handleChange("email")}
						required
					/>

					<Input
						label="Password"
						type="password"
						value={formData.password}
						onChange={handleChange("password")}
						required
					/>
					{error && <p className="text-red-500">{error}</p>}
					<Button
						type="submit"
						color="primary"
						primary
						className="py-6 w-full font-semibold text-lg"
					>
						Sign Up
					</Button>
				</form>
			</div>
		</div>
	);
}

export default SignupPage;
