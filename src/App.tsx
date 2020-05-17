import * as React from "react";
import "./styles.css";
import { CacheScope } from "./ContextCache";
import CachedComp from "./CachedComp";
import UnCachedComp from "./UnCachedComp";
import ClearCacheButton from "./ClearCacheButton";
import { FlexRow, FlexColumn } from "./Flex";

export default function App() {
  return (
    <CacheScope>
      <div className="App">
        <FlexColumn>
          <h1>Context Cache Example</h1>
          <h2>
            Refresh the page to see how many times the mock resource is called
          </h2>
          <ClearCacheButton />
          <FlexRow>
            <FlexColumn>
              <div>Using Context Cache</div>
              <CachedComp />
              <CachedComp />
              <CachedComp />
              <CachedComp />
            </FlexColumn>
            <FlexColumn>
              <div>No Cache</div>
              <UnCachedComp />
              <UnCachedComp />
              <UnCachedComp />
              <UnCachedComp />
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
      </div>
    </CacheScope>
  );
}
