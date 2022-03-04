import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function Drawer(props) {
	const { open, toggleDrawer } = props;
	const closeDrawer = () => toggleDrawer(false);

	return (
		<MuiDrawer anchor="left" open={open} onClose={closeDrawer}>
			<Box sx={{ width: 250 }}>
				<List>
					<ListItem>
						<ListItemText
							primary={"OpenPoll"}
							secondary={"Version 1.0"}
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem component={Link} to="/impressum" button>
						<ListItemText primary={"Impressum"} />
					</ListItem>
					<ListItem
						component={Link}
						to="/datenschutzerklaerung"
						button
					>
						<ListItemText primary={"Datenschutzerklärung"} />
					</ListItem>
					<ListItem component={Link} to="/nutzungsbedingungen" button>
						<ListItemText primary={"Nutzungsbedingungen"} />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem component={Link} to="/" button>
						<ListItemText
							primary={
								<Typography color="error">Beenden</Typography>
							}
						/>
					</ListItem>
				</List>
			</Box>
		</MuiDrawer>
	);
}

export default Drawer;
