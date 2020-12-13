using System;
using System.Collections.Generic;
using System.Linq;

public static class ShuffleExtension {
    private static Random rng = new Random();  
    public static IList<T> Shuffle<T>(this IList<T> list)  
    {  
        return list
            .OrderBy(p => rng.Next())
            .ToList();
    }
}