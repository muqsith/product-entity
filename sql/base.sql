CREATE TABLE categories (
    id uuid DEFAULT uuid_generate_v4 (),
    parentid uuid, -- null for a root category
    name VARCHAR NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4 (),
    name VARCHAR NOT NULL,
    price NUMERIC(5, 2),
    description VARCHAR,
    categoryid uuid NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
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