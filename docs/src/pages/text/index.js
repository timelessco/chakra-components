import { Text as BaseText } from '../../../../src/components/Text';
import { withTheme } from '../../components/withTheme';

const Text = withTheme(BaseText);
const Body1 = withTheme(BaseText.Body1);
const Body2 = withTheme(BaseText.Body2);
const Body3 = withTheme(BaseText.Body3);

Text.Body1 = Body1;
Text.Body2 = Body2;
Text.Body3 = Body3;

export default Text;
