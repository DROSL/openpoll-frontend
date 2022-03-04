import { Link } from "react-router-dom";

import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const links = [
	{
		name: "Impresseum",
		url: "/impressum",
	},
	{
		name: "Datenschutzerklärung",
		url: "/datenschutzerklaerung",
	},
	{
		name: "Nutzungsbedingungen",
		url: "/nutzungsbedingungen",
	},
];

function Footer() {
	return (
		<Toolbar>
			{links.map((link) => (
				<Button
					component={Link}
					to={link.url}
					variant="text"
					color="inherit"
				>
					{link.name}
				</Button>
			))}
		</Toolbar>
	);
}

export default Footer;
