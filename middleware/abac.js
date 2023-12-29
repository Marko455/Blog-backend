export function checkEmailLength(users) {
	return (req, res, next) => {
		if(users?.email.length >= 9) {
			next();
		}
        else{
            res.status(403).send('Neautoriziran');
        }
	}
}