# Builder Track Report - Week 4

***Name***: Elliot Lucky

***Week Ending***: 29-05-2026

## Courses Completed

- Explored module 7 of the Rust book, which focuses on organizing larger Rust projects with packages, crates, and modules
    - Packages and crates
    - Separation of concepts
    - Modules, paths and grouping related code
    - Difference between binary and library crates
    - Code structuring principles
    - Visibility and privacy rules
    - Bringing paths into scope with `use`
    - Splitting modules across multiple files


## Key Learning

- Deepened understanding of how Rust projects are organized as they grow beyond a single file. Key concepts:
    - A package is a Cargo-managed project that contains a `Cargo.toml` file and can include one or more crates.
    - A crate is the compilation unit in Rust. Binary crates produce executable programs, while library crates expose reusable functionality.
    - Modules help group related code inside a crate, making it easier to separate responsibilities and keep the codebase readable.
    - Rust builds a module tree from the crate root, and paths are used to access items within that tree.
    - Absolute paths start from the crate root, while relative paths start from the current module.
    - The `use` keyword brings paths into scope, reducing repetition when working with deeply nested modules.
    - Rust keeps items private by default. The `pub` keyword is used to expose modules, functions, structs, enums, and fields when access is needed.
    - Splitting modules across multiple files helps keep larger projects organized without changing the logical module structure.
    - Separating concerns across modules makes a project easier to understand, maintain, and extend.

## Practical Progress

- Practiced thinking through how a Rust project should be structured when code starts becoming too large for a single file.
- Reviewed how to group related functionality into modules and expose only the parts that other modules need to use.
- Improved familiarity with package layout, crate boundaries, and the difference between application code and reusable library code.
- Worked through how public and private items affect API design, especially when deciding what should be available outside a module.
- Built a clearer mental model of how Rust projects can grow from small examples into cleaner multi-file codebases while staying readable.
