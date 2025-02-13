<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TrainerDetails;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Kreiranje trenera
        $trainers = [
            [
                'name' => 'Marko Petrović',
                'email' => 'marko@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381631234567',
                'specializations' => 'Personalni trening,Bodybuilding,Funkcionalni trening',
                'certifications' => 'NASM-CPT,ACE Certified,Crossfit Level 1',
                'bio' => 'Sa više od 8 godina iskustva u fitnesu, specijalizovan sam za transformacije tela i funkcionalni trening. Moj pristup kombinuje najnovije naučne metode sa praktičnim iskustvom.'
            ],
            [
                'name' => 'Ana Jovanović',
                'email' => 'ana@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381641234567',
                'specializations' => 'Yoga,Pilates,Ishrana',
                'certifications' => 'RYT-200,Stott Pilates,Nutrition Specialist',
                'bio' => 'Sertifikovani instruktor yoge i pilatesa sa fokusom na holistički pristup zdravlju. Pomažem klijentima da postignu balans uma i tela kroz personalizovane programe vežbanja.'
            ],
            [
                'name' => 'Nikola Đorđević',
                'email' => 'nikola@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381651234567',
                'specializations' => 'Snaga,Powerlifting,Olimpijsko dizanje',
                'certifications' => 'CSCS,IPF Coach,Olympic Weightlifting Coach',
                'bio' => 'Profesionalni powerlifting trener i bivši takmičar. Specijalizovan za razvoj snage i tehnike u olimpijskom dizanju tegova. Pomažem sportistima da dostignu svoj puni potencijal.'
            ],
            [
                'name' => 'Sara Nikolić',
                'email' => 'sara@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381661234567',
                'specializations' => 'HIIT,Kardio,Gubitak težine',
                'certifications' => 'ACE-CPT,TRX Certified,Precision Nutrition',
                'bio' => 'Energična i posvećena treneru sa strašću za HIIT treninge i kardio programe. Pomažem klijentima da postignu svoje ciljeve kroz intenzivne i efikasne treninge.'
            ],
            [
                'name' => 'Luka Stanković',
                'email' => 'luka@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381671234567',
                'specializations' => 'Rehabilitacija,Korektivne vežbe,Senior Fitness',
                'certifications' => 'Physical Therapy Cert,Corrective Exercise Specialist,Senior Fitness Specialist',
                'bio' => 'Specijalizovan za rehabilitaciju i korektivne vežbe. Radim sa klijentima svih uzrasta, sa posebnim fokusom na prevenciju povreda i pravilnu tehniku vežbanja.'
            ],
            [
                'name' => 'Mila Popović',
                'email' => 'mila@fitmreza.com',
                'password' => 'Password123!',
                'type' => 'trainer',
                'phone_number' => '+381681234567',
                'specializations' => 'Plesni fitnes,Zumba,Aerobik',
                'certifications' => 'Zumba Instructor,Dance Fitness Cert,Group Fitness Instructor',
                'bio' => 'Profesionalna plesačica i fitnes instruktor. Kroz kombinaciju plesa i fitnesa pomažem klijentima da ostanu motivisani i postignu svoje fitnes ciljeve na zabavan način.'
            ]
        ];

        foreach ($trainers as $trainerData) {
            $user = User::create([
                'name' => $trainerData['name'],
                'email' => $trainerData['email'],
                'password' => Hash::make($trainerData['password']),
                'type' => $trainerData['type'],
                'phone_number' => $trainerData['phone_number'],
                'is_active' => true
            ]);

            TrainerDetails::create([
                'user_id' => $user->id,
                'specializations' => $trainerData['specializations'],
                'certifications' => $trainerData['certifications'],
                'bio' => $trainerData['bio']
            ]);
        }

        // Kreiranje test korisnika
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!'),
            'type' => 'user',
            'is_active' => true
        ]);
    }
}
