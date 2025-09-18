"use client";
import { Suspense } from "react";
import ClientWeatherPage from "./client";

export default function WeatherPage() {
	

	return (

    <>
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center">Loading...</div>}>
    <ClientWeatherPage />
    </Suspense>
    </>
  )
		
}




