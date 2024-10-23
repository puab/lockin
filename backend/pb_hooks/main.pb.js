routerAdd('GET', '/ping', c => {
    return c.json(200, { message: 'pong' });
});

routerAdd('POST', '/check-credentials', c => {
    const data = $apis.requestInfo(c).data;
    const { username, password } = data;

    const passwordHash = $security.hs256(password);

    try {
        const record = $app
            .dao()
            .findFirstRecordByFilter(
                'users',
                'username = {:username} && passwordHash = {:passwordHash}',
                { username, passwordHash: passwordHash.toString() }
            );

        if (record) {
            return c.json(200, {
                message: 'success',
                encryptionKey: $security.md5(password),
            });
        }
    } catch (e) {
        return c.json(401, { message: 'Invalid credentials' });
    }

    return c.json(401, { message: 'Invalid credentials' });
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
