import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa6";

const server = "https://blend-iujv.onrender.com";
function LoginPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (field) => (e) => {
		setFormData({ ...formData, [field]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const url = `${server}/api/auth/login`;
			const result = await axios.post(url, formData);
			if (result.status === 200) {
				alert("Success full Login");
			} else {
				setError(result?.data?.message || "An error occurred Try Again Later");
			}
		} catch (error) {
			setError(
				error.response.data.message || "An error occurred Try Again Later"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex bg-black h-screen w-screen">
			<div className="h-full w-1/2 flex justify-center items-center bg-black">
				<h1 className="text-primary font-extrabold text-[400px] border-8 flex justify-center items-center h-[600px] text-center w-[600px] rounded-full border-primary">
					B
				</h1>
			</div>
			<div className="h-full w-1/2 bg-black flex flex-col justify-center items-center">
				<h1 className="text-white text-4xl font-bold mb-8">Lets Go</h1>
				<form onSubmit={handleSubmit} className="w-2/3 space-y-4">
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
						isLoading={loading}
						type="submit"
						color="primary"
						primary
						className="py-6 w-full font-semibold text-lg"
					>
						Login
					</Button>
					<Button
						isLoading={loading}
						variant="bordered"
						color="primary"
						className="py-6 w-full font-semibold text-lg"
					>
						Forgot Password?
					</Button>
				</form>

				<p className="text-white text-lg mt-4 font-bold">
					Don't have an account?{" "}
					<a href="/signup" className="text-primary hover:text-primary-dark">
						Sign Up
					</a>
				</p>
			</div>
		</div>
	);
}

export default LoginPage;
