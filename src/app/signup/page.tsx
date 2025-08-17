"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { signupSchema } from "@/lib/validations/auth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  // Validation schemas
  const usernameSchema = signupSchema.shape.username;
  const nameSchema = signupSchema.shape.name;
  const emailSchema = signupSchema.shape.email;
  const passwordSchema = signupSchema.shape.password;

  const validateField = (schema: z.ZodTypeAny, value: string) => {
    const result = schema.safeParse(value);
    if (result.success) return { valid: true, error: "" };
    return {
      valid: false,
      error: result.error.issues[0]?.message || "Validation failed",
    };
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateConfirmPassword()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      if (response.ok) {
        setLoading(false);
        toast("Account Created Successfully!");
      } else {
        setLoading(false);
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Register Account</CardTitle>
            <CardDescription>
              Enter your details below to register new account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p
                className={`text-xs ${
                  username
                    ? validateField(usernameSchema, username).valid
                      ? "text-muted-foreground"
                      : "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {username
                  ? validateField(usernameSchema, username).error ||
                    "Looks good!"
                  : "Username must be between 3–16 characters, only letters/numbers/_/-"}
              </p>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p
                className={`text-xs ${
                  name
                    ? validateField(nameSchema, name).valid
                      ? "text-muted-foreground"
                      : "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {name
                  ? validateField(nameSchema, name).error || "Looks good!"
                  : "Optional — must be 3–16 characters, letters only"}
              </p>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p
                className={`text-xs ${
                  email
                    ? validateField(emailSchema, email).valid
                      ? "text-muted-foreground"
                      : "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {email
                  ? validateField(emailSchema, email).error || "Valid email!"
                  : "Enter a valid email address"}
              </p>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
                className={`text-xs ${
                  password
                    ? validateField(passwordSchema, password).valid
                      ? "text-muted-foreground"
                      : "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {password
                  ? validateField(passwordSchema, password).error ||
                    "Strong Password!"
                  : "At least 8 characters, with uppercase, lowercase, number, and special character"}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value && password !== e.target.value) {
                    setConfirmPasswordError("Passwords do not match");
                  } else {
                    setConfirmPasswordError("");
                  }
                }}
                onBlur={validateConfirmPassword}
              />
              <p
                className={`text-xs ${
                  confirmPasswordError
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {confirmPasswordError || "Passwords must match"}
              </p>
            </div>

            <p>
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !username || !email || !password}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
