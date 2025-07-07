<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SmsTemplate;

class SmsTemplateSeeder extends Seeder
{
    public function run()
    {
        // Delete existing SMS templates
        SmsTemplate::truncate();

        // Create SMS templates
        $templates = [
            [
                'name' => 'Booking Confirmation message',
                'content' => 'Dear {user}, This message is the evidence for you booking and you booked {seat} from {bus} on the date of {date} and your total amount is {amount}. please show this message / downloaded QR to the conductor to Confirm you seats. Thank you for choosing us, RS Express.',
            ],
            [
                'name' => 'Payment Success message',
                'content' => 'Dear {user}, We are received your payment Successfully and the amount that you have pay {amount} on {date}. Thank you for Choosing us, RS Express.',
            ],
            [
                'name' => 'Wish for festival',
                'content' => 'Dear {user}, We are wishing you for your festival celebration. be happy with your family RS Express, Thank you.',
            ],
            [
                'name' => 'Booking Cancellation',
                'content' => 'Dear {user}, Your booking for {seat} from {bus} on {date} has been cancelled successfully. Refund amount {amount} will be processed within 3-5 working days. Thank you, RS Express.',
            ],
            [
                'name' => 'Departure Reminder',
                'content' => 'Dear {user}, This is a reminder that your bus {bus} from {start_point} to {end_point} is departing tomorrow at {departure_time}. Please arrive 30 minutes early. Thank you, RS Express.',
            ],
            [
                'name' => 'Loyalty Points Earned',
                'content' => 'Dear {user}, Congratulations! You have earned {points} loyalty points for your recent booking. Your total points: {total_points}. Keep traveling with us to earn more rewards! RS Express.',
            ],
        ];

        foreach ($templates as $template) {
            SmsTemplate::create($template);
        }

        echo "SMS templates created successfully!\n";
        echo "Created " . count($templates) . " SMS templates.\n";
    }
}
