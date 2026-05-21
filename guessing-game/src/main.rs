use rand::Rng;
use std::cmp::Ordering;
use std::io;

const MAX_AMOUNT_OF_GUESSES: i32 = 10;

fn main() {
    println!("Guess the number!");
    for index in 0..=MAX_AMOUNT_OF_GUESSES {
        println!("Current index: {index}");
        if index == MAX_AMOUNT_OF_GUESSES {
            println!("You have used up your guesses!");
            break;
        }

        let secret_number: u32 = rand::thread_rng().gen_range(1..=100);
        // println!("Generated secret number is {secret_number}");
        let trials_left: i32 = MAX_AMOUNT_OF_GUESSES - index;
        println!("Please input your guess. Trial Left: {trials_left}");
        let mut guess: String = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            // Equivalence of switch/case statment in typescript
            Ordering::Equal => {
                println!("You win!");
                break;
            }
            Ordering::Greater => println!("Too large!"),
            Ordering::Less => println!("Too small!"),
        }

    }
}
