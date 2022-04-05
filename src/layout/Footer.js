import { Link } from "react-router-dom";

import MuiLink from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

function Footer() {
	return (
		<Toolbar>
			<Button
				component={MuiLink}
				href="https://www.ovgu.de/Impressum.html"
				target="_blank"
				variant="text"
				color="inherit"
			>
				Impressum
			</Button>
			<Button
				component={MuiLink}
				href="https://www.ovgu.de/datenschutzerklaerung.html"
				target="_blank"
				variant="text"
				color="inherit"
			>
				Datenschutzerklärung
			</Button>
			<Button
				component={Link}
				to="/nutzungsbedingungen"
				variant="text"
				color="inherit"
			>
				Nutzungsbedingungen
			</Button>
		</Toolbar>
	);
}

export default Footer;
