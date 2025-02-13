import React, { useEffect } from "react";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { LoginPage } from "modules/auth/pages/LoginPage";
import { SignUpPage } from "modules/auth/pages/SignUpPage";
import { AccountPage } from "modules/account/pages/AccountPage/AccountPage";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { UnauthorisedLayout } from "./layouts/UnauthorisedLayout/UnauthorisedLayout";
import { RootStackParamList } from "types/RootStackParamList";
import { OrderCreatePage } from "modules/order/pages/OrderCreatePage/OrderCreatePage";
import { OrderHistoryPage } from "modules/order/pages/OrderHistoryPage/OrderHistoryPage";
import { useLazyGetMeQuery } from "modules/account/redux/api";
import { OrderProposedPricesStoragePage } from "modules/order/pages/OrderProposedPricesStoragePage/OrderProposedPricesStoragePage";
import { OrderProposedPricesPage } from "modules/order/pages/OrderProposedPricesPage/OrderProposedPricesPage";
import { OrderStorageHistoryPage } from "modules/order/pages/OrderStorageHistoryPage/OrderStorageHistoryPage";

const Stack = createStackNavigator<RootStackParamList>();

const AppRoutes: React.FC = () => {
  const { token, user } = useTypedSelector((state) => state.auth);
  const [getMe] = useLazyGetMeQuery();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const currentRoute = useNavigationState(
    (state) => state?.routes?.[state.index]?.name ?? null
  );

  useEffect(() => {
    const initializeUser = async () => {
      if (token && !user) {
        try {
          await getMe().unwrap();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    initializeUser();
  }, [token, user, getMe]);

  useEffect(() => {
    if (!token) {
      navigation.navigate("Login");
    }
  }, [token, user, navigation]);

  return (
    <>
      {token ? (
        <MainLayout>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Account"
          >
            <Stack.Screen
              name="Account"
              options={{ headerShown: false }}
              component={AccountPage}
            />
            <Stack.Screen
              name="OrderCreate"
              options={{ headerShown: false }}
              component={
                user?.current_order === null
                  ? OrderCreatePage
                  : OrderProposedPricesPage
              }
            />
            <Stack.Screen
              name="OrderProposedPricesStoragePage"
              options={{ headerShown: false }}
              component={OrderProposedPricesStoragePage}
            />
            <Stack.Screen
              name="OrderHistory"
              options={{ headerShown: false }}
              component={OrderHistoryPage}
            />
            <Stack.Screen
              name="OrderStorageHistory"
              options={{ headerShown: false }}
              component={OrderStorageHistoryPage}
            />
          </Stack.Navigator>
        </MainLayout>
      ) : (
        <UnauthorisedLayout>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={LoginPage}
            />
            <Stack.Screen
              name="SignUp"
              options={{ headerShown: false }}
              component={SignUpPage}
            />
          </Stack.Navigator>
        </UnauthorisedLayout>
      )}
    </>
  );
};

export default AppRoutes;
