import { Heading as BaseHeading } from '../../../../src/components/Heading';
import { withTheme } from '../../components/withTheme';

const Heading = withTheme(BaseHeading);
const H1 = withTheme(BaseHeading.H1);
const H2 = withTheme(BaseHeading.H2);

Heading.H1 = H1;
Heading.H2 = H2;

export default Heading;
