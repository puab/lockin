routerAdd('GET', '/ping', c => {
    return c.json(200, { message: 'pong' });
});

routerAdd('POST', '/check-credentials', c => {
    // paņem datus no request body
    const data = $apis.requestInfo(c).data;
    const { username, password } = data;

    // šifrē paroli ar sha256
    const passwordHash = $security.hs256(password);

    // meklē lietotāju ar šo username un passwordHash
    try {
        const record = $app
            .dao()
            .findFirstRecordByFilter(
                'users',
                'username = {:username} && passwordHash = {:passwordHash}',
                { username, passwordHash: passwordHash.toString() }
            );

        // ja lietotājs ir atrasts, atgriež 200 statusu un atslēgu ar kuru šifrēt eksporta datus
        // vai atšifrēt importa datus
        if (record) {
            return c.json(200, {
                message: 'success',
                encryptionKey: $security.md5(password),
            });
        }
    } catch (e) {
        // ja lietotājs nav atrasts, atgriež 401 statusu
        return c.json(401, { message: 'Invalid credentials' });
    }

    // ja lietotājs nav atrasts, atgriež 401 statusu
    return c.json(401, { message: 'Invalid credentials' });
});

routerAdd('POST', '/register', c => {
    const data = $apis.requestInfo(c).data;
    const { username, password } = data;

    const passwordHash = $security.hs256(password);

    try {
        const userCollection = $app.dao().findCollectionByNameOrId('users');

        const user = new Record(userCollection);
        user.set('username', username);
        user.set('passwordHash', passwordHash);

        $app.dao().saveRecord(user);

        return c.json(200, {
            message: 'success',
        });
    } catch (e) {
        if (e.toString().includes('UNIQUE constraint failed')) {
            return c.json(401, { message: 'Username already taken' });
        }

        return c.json(401, { message: 'Invalid credentials' });
    }
});

routerAdd('POST', '/export-data', c => {
    const data = $apis.requestInfo(c).data;
    const { username, data: syncedData } = data;

    try {
        const record = $app
            .dao()
            .findFirstRecordByFilter('users', 'username = {:username}', {
                username,
            });

        if (record) {
            record.set('syncedData', syncedData);

            $app.dao().saveRecord(record);

            return c.json(200, {
                message: 'success',
            });
        }
    } catch (e) {
        return c.json(401, { message: 'Invalid credentials' });
    }

    return c.json(401, { message: 'Invalid credentials' });
});

routerAdd('POST', '/import-data', c => {
    const data = $apis.requestInfo(c).data;
    const { username } = data;

    try {
        const record = $app
            .dao()
            .findFirstRecordByFilter('users', 'username = {:username}', {
                username,
            });

        if (record) {
            $app.dao().saveRecord(record);

            return c.json(200, {
                message: 'success',
                data: record.get('syncedData'),
            });
        }
    } catch (e) {
        return c.json(401, { message: 'Invalid credentials' });
    }

    return c.json(401, { message: 'Invalid credentials' });
});
