import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';

// POST - Handle contact form submission
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, trip_dates, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json({ 
                error: 'Name, email, and message are required' 
            }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                error: 'Please enter a valid email address' 
            }, { status: 400 });
        }

        // Save inquiry to Supabase
        const { error: dbError } = await supabase
            .from('inquiries')
            .insert([{
                name,
                email,
                trip_dates: trip_dates || null,
                message,
                status: 'new'
            }]);

        if (dbError) throw dbError;

        // Send email notification to admin
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'baltrotraders1234@gmail.com',
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: '"Smile For Miles Website" <baltrotraders1234@gmail.com>',
                to: 'baltrotraders1234@gmail.com',
                subject: `New Contact Inquiry - Smile For Miles`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">✈️ Smile For Miles</h1>
                            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">New Contact Inquiry</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">You have a new inquiry from your website:</p>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name:</td>
                                        <td style="padding: 8px 0; color: #333;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                                        <td style="padding: 8px 0; color: #333;">
                                            <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                                        </td>
                                    </tr>
                                    ${trip_dates ? `
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Trip Dates:</td>
                                        <td style="padding: 8px 0; color: #333;">${trip_dates}</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                                        <td style="padding: 8px 0; color: #333;">${message}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                                <p style="color: #888; font-size: 14px; margin: 0;">
                                    This email was sent from your website contact form.<br>
                                    Submitted on: ${new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                            <p>© ${new Date().getFullYear()} Smile For Miles Travel. All rights reserved.</p>
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email notification sent successfully');
        } catch (emailError: any) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the request if email fails - inquiry is still saved
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Your message has been sent! We will contact you soon.' 
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error processing contact form:', error);
        return NextResponse.json({ 
            error: `Failed to send message: ${error.message}` 
        }, { status: 500 });
    }
}
