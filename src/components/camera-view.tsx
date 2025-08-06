"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera as CameraIcon, Check, RefreshCcw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";

type CameraViewProps = {
    onPhotoTaken: (dataUri: string) => void;
    onBack: () => void;
}

export function CameraView({ onPhotoTaken, onBack }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    
    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('Camera API not supported');
                 toast({
                    variant: 'destructive',
                    title: 'Not Supported',
                    description: 'Your browser does not support the camera API.',
                });
                setHasCameraPermission(false);
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setHasCameraPermission(true);

                if (videoRef.current) {
                videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings.',
                });
            }
        };

        if(capturedImage === null) {
            getCameraPermission();
        }

        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }

    }, [capturedImage, toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUri = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUri);
        }
    }

    const handleConfirm = () => {
        if (capturedImage) {
            onPhotoTaken(capturedImage);
        }
    }

    const handleRetake = () => {
        setCapturedImage(null);
    }
    
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
             <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Form
            </Button>
            <Card>
                <CardHeader>
                    {hasCameraPermission === false && (
                         <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature. Check your browser settings.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>
                <CardContent>
                   <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                        {capturedImage ? (
                             <Image src={capturedImage} alt="Captured preview" layout="fill" objectFit="contain" />
                        ) : (
                             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                   </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    {capturedImage ? (
                        <>
                            <Button onClick={handleRetake} variant="outline">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Retake
                            </Button>
                            <Button onClick={handleConfirm}>
                                <Check className="mr-2 h-4 w-4" />
                                Use this Photo
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                            <CameraIcon className="mr-2 h-4 w-4" />
                            Capture Photo
                        </Button>
                    )}

                </CardFooter>
            </Card>
        </div>
    )

}
