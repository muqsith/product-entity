CREATE TABLE categories (
    id uuid DEFAULT uuid_generate_v4 (),
    parentid uuid, -- null for a root category
    name TEXT NOT NULL,
    status VARCHAR DEFAULT 'ACTIVE',
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
    price NUMERIC(5, 2),
    description TEXT,
    categoryid uuid NOT NULL,
    status VARCHAR NOT NULL,
    FOREIGN KEY (categoryid) REFERENCES categories (id),
    PRIMARY KEY (id)
);

CREATE TABLE product_images (
    id uuid DEFAULT uuid_generate_v4 (),
    productid uuid NOT NULL,
    url VARCHAR NOT NULL,
    main BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (productid) REFERENCES products (id),
    PRIMARY KEY (id)
);

