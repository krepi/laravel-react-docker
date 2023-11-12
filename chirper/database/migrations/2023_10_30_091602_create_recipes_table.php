<?php
//
//use Illuminate\Database\Migrations\Migration;
//use Illuminate\Database\Schema\Blueprint;
//use Illuminate\Support\Facades\Schema;
//
//return new class extends Migration
//{
//    /**
//     * Run the migrations.
//     */
//    public function up(): void
//    {
//        Schema::create('recipes', function (Blueprint $table) {
//            $table->id();
//            $table->string('title');
//            $table->text('body');
//            $table->unsignedBigInteger('user_id');
//            $table->timestamps();
//
//            $table->foreign('user_id')->references('id')->on('users');
//        });
//    }
//
//    /**
//     * Reverse the migrations.
//     */
//    public function down(): void
//    {
//        Schema::dropIfExists('recipes');
//    }
//};
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title', 250); // Ograniczenie długości tytułu
            $table->json('ingredients'); // Przechowywanie składników jako JSON
            $table->text('instructions'); // Instrukcje przygotowania przepisu
            $table->integer('ready_in_minutes')->nullable(); // Czas przygotowania
            $table->integer('servings')->nullable(); // Liczba porcji
            $table->string('image')->nullable(); // Ścieżka do obrazu
            $table->enum('source', ['spoon', 'user']); // Źródło przepisu
            $table->unsignedBigInteger('user_id'); // Klucz obcy użytkownika
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users'); // Relacja z tabelą użytkowników
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
