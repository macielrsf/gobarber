import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const { authorization } = req.headers;

    if ( !authorization ) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;

        if ( !decoded ) {
            return res.status(401).json({ error: 'User does not autheticated.' });
        }
    }
    catch(e) {
        console.log(e);
        return res.status(401).json({ error: 'Token invalid.' });
    }

    return next();
}
